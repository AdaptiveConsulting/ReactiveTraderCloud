using Adaptive.ReactiveTrader.Shared.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    public class WampServiceClient : IDisposable
    {
        public const int DisconnectTimeoutInSeconds = 10;

        private readonly IWampConnection _connection;
        private readonly string _serviceType;
        private readonly CompositeDisposable _disposables = new CompositeDisposable();
        private readonly IConnectableObservable<IDictionary<string, ILastValueObservable<ServiceInstanceStatus>>> _serviceInstanceStreamCache;
        private readonly ILog _log;

        public WampServiceClient(IWampConnection connection, string serviceType, IScheduler scheduler, ILoggerFactory loggerFactory)
        {
            _log = loggerFactory.Create(typeof(WampServiceClient));
            _connection = connection;
            _serviceType = serviceType;
            _serviceInstanceStreamCache = CreateServiceInstanceDictionaryStream(serviceType, scheduler)
                .Multicast(new BehaviorSubject<IDictionary<string, ILastValueObservable<ServiceInstanceStatus>>>(
                               new Dictionary<string, ILastValueObservable<ServiceInstanceStatus>>()));
        }

        public void Connect()
        {
            _disposables.Add(_serviceInstanceStreamCache.Connect());
        }

        public IObservable<ServiceStatusSummary> ServiceStatusStream
        {
            get
            {
                return
                    _serviceInstanceStreamCache.Select(
                        cache => new ServiceStatusSummary(cache.Values.Count, cache.Values.Any(v => v.LatestValue.IsConnected)));
            }
        }

        private IObservable<IDictionary<string, ILastValueObservable<ServiceInstanceStatus>>> CreateServiceInstanceDictionaryStream(
            string serviceType,
            IScheduler scheduler)
        {

            return Observable.Create<IDictionary<string, ILastValueObservable<ServiceInstanceStatus>>>(o =>
            {
                var connectionStatus = _connection.ConnectionStatus.Publish().RefCount();
                var isConnectedStream = connectionStatus.Where(isConnected => isConnected);

                var errorOnDisconnectStream = connectionStatus.Where(isConnected => !isConnected).
                                                               Take(1)
                                                              .SelectMany(Observable.Throw<ServiceInstanceStatus>(new InvalidOperationException("Disconnected")));

                // a stream of all service instance status, yields a disconnect when the underlying connection goes down
                var serviceInstanceDictionaryStream = _connection.SubscribeToTopic<ServiceStatusDto>("status")
                                                                 .Where(s => s.Type == serviceType)
                                                                 .Select(dto => ServiceInstanceStatus.CreateForConnected(dto.Type, dto.Instance, dto.Load))
                    // If the underlying connection goes down we error the stream.
                    // Do this before the grouping so all grouped streams error.
                                                                 .Merge(errorOnDisconnectStream)
                                                                 .GroupBy(serviceStatus => serviceStatus.ServiceId)
                    // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
                                                                 .DebounceOnMissedHeartbeat(TimeSpan.FromSeconds(DisconnectTimeoutInSeconds),
                                                                                            serviceId => ServiceInstanceStatus.CreateForDisconnected(
                                                                                                serviceType,
                                                                                                serviceId),
                                                                                            scheduler)
                    // flattens all our service instances stream into an observable dictionary so we query the service with the least load on a per-subscribe basis
                                                                 .ToLastValueObservableDictionary(serviceStatus => serviceStatus.ServiceId)
                    // catch the disconnect error of the outter stream and continue with an empty (thus disconencted) dictionary
                                                                 .Catch(Observable.Return(
                                                                         new Dictionary<string, ILastValueObservable<ServiceInstanceStatus>>()));
                return isConnectedStream
                    .Take(1)
                    // selectMany: since we're just taking one, this effectively just continues the stream by subscribing to serviceInstanceDictionaryStream
                    .SelectMany(serviceInstanceDictionaryStream)
                    // repeat after disconnects
                    .Repeat()
                    .Subscribe(o);
            });
        }

        public IObservable<TResponse> CreateRequestResponseOperation<TRequest, TResponse>(string operationName, TRequest request, bool waitForSuitableService = false)
        {
            return Observable.Create<TResponse>(o =>
            {
                _log.Info("Creating request response operation");
                var disposables = new CompositeDisposable();
                disposables.Add(
                    // we only take one as once we've found a service we use that for the remainder of the operation, 
                    // if there are errors, a higher level service will deal with how to retry
                    _serviceInstanceStreamCache.GetServiceWithMinLoad(waitForSuitableService)
                                               .Take(1)
                                               .Subscribe(serviceInstanceStatus =>
                                               {
                                                   if (!serviceInstanceStatus.IsConnected)
                                                   {
                                                       o.OnError(new InvalidOperationException("Disconnected"));
                                                   }

                                                   var remoteProcedure = $"{serviceInstanceStatus.ServiceId}.{operationName}";
                                                   _log.Info($"Will use service instance [{serviceInstanceStatus}] for request response operation");
                                                   disposables.Add(
                                                       _connection
                                                           .RequestResponse<TRequest, TResponse>(remoteProcedure, request)
                                                           .Subscribe(o)
                                                       );
                                               },
                                                          o.OnError,
                                                          o.OnCompleted));
                return disposables;
            });
        }

        public IObservable<TResponse> CreateStreamOperation<TRequest, TResponse>(string operationName, TRequest request)
        {
            return Observable.Create<TResponse>(o =>
            {
                _log.Info("Creating stream operation");
                var disposables = new CompositeDisposable();
                var topicName = GetPrivateTopicName();
                var hasSubscribed = false;

                disposables.Add(
                    _serviceInstanceStreamCache.GetServiceWithMinLoad()
                                               .Take(1)
                                               .Subscribe(statusStream =>
                                               {
                                                   if (!statusStream.IsConnected)
                                                   {
                                                       o.OnError(new InvalidOperationException("Disconnected"));
                                                   }
                                                   else if (!hasSubscribed)
                                                   {
                                                       hasSubscribed = true;
                                                   }

                                                   var serviceInstance = statusStream.ServiceId;
                                                   _log.Info($"Will use service instance [{serviceInstance}] for stream operation");
                                                   disposables.Add(_connection.SubscribeToTopic<TResponse>(topicName)
                                                                              .Subscribe(o));

                                                   var remoteProcedure = $"{serviceInstance}.{operationName}";

                                                   disposables.Add(_connection.RequestResponse<TRequest, TResponse>(remoteProcedure,
                                                                                                                    request,
                                                                                                                    topicName)
                                                                              .Subscribe(_ => _log.Info($"Ack received for stream operation {operationName}"),
                                                                                  o.OnError,
                                                                                  o.OnCompleted));
                                               }));
                return disposables;
            });
        }

        public void Dispose()
        {
            _disposables.Dispose();
        }

        private string GetPrivateTopicName()
        {
            return $"topic_{_serviceType}_{Guid.NewGuid().ToString("n")}";
        }
    }
}
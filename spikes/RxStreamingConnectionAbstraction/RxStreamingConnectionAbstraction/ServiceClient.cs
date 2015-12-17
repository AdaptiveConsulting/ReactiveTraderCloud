using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace RxStreamingConnectionAbstraction
{
    public class ServiceClient : IDisposable
    {
        public const int DISCONNECT_TIMEOUT_IN_SECONDS = 10;

        private readonly Connection _connection;
        private readonly CompositeDisposable _displsables = new CompositeDisposable();
        private readonly IConnectableObservable<IDictionary<string, ILastValueObservable<ServiceStatus>>> _serviceInstanceStreamCache;

        public ServiceClient(Connection connection, string serviceType, IScheduler scheduler)
        {
            _connection = connection;
            _serviceInstanceStreamCache = CreateServiceStatusObservableDictionaryStream(serviceType, scheduler);
        }

        public void Connect()
        {
            _displsables.Add(_serviceInstanceStreamCache.Connect());
        }

        public IObservable<ServiceStatusSummary> ServiceStatusStream
        {
            get
            {
                return _serviceInstanceStreamCache.Select(cache => new ServiceStatusSummary(cache.Values.Count, cache.Values.Any(v => v.LatestValue.IsConnected)));
            }
        }

        private IConnectableObservable<IDictionary<string, ILastValueObservable<ServiceStatus>>> CreateServiceStatusObservableDictionaryStream(string serviceType, IScheduler scheduler)
        {
            var connectionStatus = _connection.ConnectionStatus.Publish().RefCount();
            IObservable<bool> isConnectedStream = connectionStatus.Where(isConnected => isConnected);
            IObservable<bool> isDisconnectedStream = connectionStatus.Where(isConnected => !isConnected);
            // a stream of all service instance status, yields a disconnect when the underlying connection goes down
            IObservable<ServiceStatus> serviceStatusStream =
                _connection.SubscribeToTopic<ServiceStatusDto>("status")
                .Where(s => s.ServiceType == serviceType)
                .Select(dto => ServiceStatus.CreateForConnected(dto.ServiceType, dto.ServiceId, dto.Load))
                .TakeUntilEndWith(isDisconnectedStream, lastServiceStatus => ServiceStatus.CreateForDisconnected(serviceType, lastServiceStatus.ServiceId));

            return isConnectedStream
                .Take(1)
                .SelectMany(serviceStatusStream)
                // we repeat our underlying status stream on disconnects
                .Repeat()
                // group by service instance id
                .GroupBy(serviceStatus => serviceStatus.ServiceId) 
                // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently 
                .TimeoutInnerObservables(TimeSpan.FromSeconds(DISCONNECT_TIMEOUT_IN_SECONDS), serviceId => ServiceStatus.CreateForDisconnected(serviceType, serviceId), scheduler)
                // wrap all our service instances up in a hot observable dictionary so we query the service with the least load on a per-subscribe basis 
                .ToLastValueObservableDictionary(serviceStatus => serviceStatus.ServiceId)
                // keep the last copy of the dictionary around for new subscribers
                .Replay(1);
        }

        public IObservable<TResponse> CreateRequestResponseOperation<TRequest, TResponse>(string topicName, TRequest request)
        {
            return Observable.Create<TResponse>(o =>
            {
                Console.WriteLine("Creating request response operation");
                var disposables = new CompositeDisposable();
                disposables.Add(
                    // we only take one as once we've found a service we use that for the remainder of the operation, 
                    // if there are errors, a higher level service will deal with how to retry
                    _serviceInstanceStreamCache.GetServiceWithMinLoad().Take(1).Subscribe(statusStream =>
                    {
                        Console.WriteLine("Will use service instance [{0}] for request response operation", statusStream.LatestValue);
                        disposables.Add(
                            _connection
                                .ExecuteRemoteCall<TRequest, TResponse>(topicName, statusStream.LatestValue, request)
                                .Take(1)
                                .Subscribe(o)
                        );
                        disposables.Add(
                            statusStream.Subscribe(status =>
                            {
                                if (!status.IsConnected)
                                {
                                    o.OnError(new Exception("Disconnected"));
                                }
                            })
                        );
                    })
                ); 
                return disposables;
            });
        }

        public IObservable<TResponse> CreateStreamOperation<TResponse>(string topicName)
        {
            return Observable.Create<TResponse>(o =>
            {
                Console.WriteLine("Creating stream operation");
                var disposables = new CompositeDisposable();
                disposables.Add(
                    _serviceInstanceStreamCache.GetServiceWithMinLoad().Take(1).Subscribe(statusStream =>
                    {
                        Console.WriteLine("Will use service instance [{0}] for stream operation", statusStream.LatestValue);
                        disposables.Add(
                            _connection
                                .SubscribeToTopic<TResponse>(topicName, statusStream.LatestValue)
                                .Subscribe(o)
                        );
                        disposables.Add(
                            statusStream.Subscribe(status =>
                            {
                                if (!status.IsConnected)
                                {
                                    o.OnError(new Exception("Disconnected"));
                                }
                            },
                            o.OnError,
                            o.OnCompleted)
                        );
                    })
                );
                return disposables;
            });
        }

        public void Dispose()
        {
            _displsables.Dispose();
        }
    }
}
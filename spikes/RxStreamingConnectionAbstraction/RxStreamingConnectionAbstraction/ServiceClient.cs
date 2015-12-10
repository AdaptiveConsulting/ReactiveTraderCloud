using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace RxGroupBy
{
    public class ServiceClient : IDisposable
    {
        public const int DISCONNECT_TIMEOUT_IN_SECONDS = 10;

        private readonly Connection _connection;
        private readonly string _serviceType;
        private readonly CompositeDisposable _displsables = new CompositeDisposable();
        private readonly IConnectableObservable<IDictionary<string, ILastValueObservable<ServiceStatus>>> _serviceInstanceStreamCache;

        public ServiceClient(Connection connection, string serviceType, IScheduler scheduler)
        {
            _connection = connection;
            _serviceType = serviceType;
            _serviceInstanceStreamCache = _connection.ServiceStatus
                .Where(status => status.ServiceType == _serviceType)
                .GroupBy(serviceStatus => serviceStatus.ServiceId)
                .TimeoutInnerObservables(TimeSpan.FromSeconds(DISCONNECT_TIMEOUT_IN_SECONDS), serviceId => new ServiceStatus(_serviceType, serviceId), scheduler)
                .ToLastValueObservableDictionary(serviceStatus => serviceStatus.ServiceId)
                .Replay(1);
        }

        public void Connect()
        {
            _displsables.Add(_serviceInstanceStreamCache.Connect());
        }

        public IObservable<ServiceStatusSummary> ServiceStatus
        {
            get
            {
                return _serviceInstanceStreamCache.Select(cache => new ServiceStatusSummary(cache.Values.Count, cache.Values.Any(v => v.LatestValue.IsConnected)));
            }
        }

        public IObservable<TResponse> CreateRequestResponseOperation<TRequest, TResponse>(TRequest request)
        {
            return Observable.Create<TResponse>(o =>
            {
                Console.WriteLine("Creating request response operation");
                var disposables = new CompositeDisposable();
                disposables.Add(
                    // we only take one as once we've found a service we use that for the remainder of the operation, 
                    // if there are errors, a higher leverl service will deal with how to retry
                    _serviceInstanceStreamCache.GetServiceWithMinLoad().Take(1).Subscribe(statusStream =>
                    {
                        Console.WriteLine("Will use service instance [{0}] for request response operation", statusStream.LatestValue);
                        disposables.Add(
                            _connection
                                .CreateRequestResponseOperation<TRequest, TResponse>(statusStream.LatestValue, request)
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

        public IObservable<TResponse> CreateStreamOperation<TResponse>()
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
                                .CreateStreamOperation<TResponse>(statusStream.LatestValue)
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

        public void Dispose()
        {
            _displsables.Dispose();
        }
    }
}
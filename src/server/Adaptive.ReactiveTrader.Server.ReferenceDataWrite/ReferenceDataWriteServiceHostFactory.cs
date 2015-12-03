using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Reactive.Disposables;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriteServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataWriteServiceHostFactory>();
        private readonly SerialDisposable _cleanup = new SerialDisposable();


        private Repository _repository;
        private ReferenceWriteService _service;

        public void Initialize(IEventStoreConnection es, IConnectionStatusMonitor monitor)
        {
            _repository = new Repository(es);
            _service = new ReferenceWriteService(_repository);
        }
        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new Repository(conn));
            var serviceStream = repositoryStream.LaunchOrKill(engine => new ReferenceWriteService(engine));
            _cleanup.Disposable = serviceStream.LaunchOrKill(brokerStream, (service, broker) => new ReferenceWriteServiceHost(service, broker)).Subscribe();

            return _cleanup;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
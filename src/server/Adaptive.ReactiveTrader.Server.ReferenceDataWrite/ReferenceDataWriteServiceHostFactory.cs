using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriteServiceHostFactory : IServceHostFactoryWithEventStore, IEventStoreConsumer,
        IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataWriteServiceHostFactory>();
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();


        private Repository _repository;
        private ReferenceWriteService _service;

        public void Initialize(IEventStoreConnection es)
        {
            _repository = new Repository(es);
            _service = new ReferenceWriteService(_repository);
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream,
            IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new Repository(conn));
            var serviceStream = repositoryStream.LaunchOrKill(engine => new ReferenceWriteService(engine));
            var disposable =
                serviceStream.LaunchOrKill(brokerStream,
                    (service, broker) => new ReferenceWriteServiceHost(service, broker)).Subscribe();

            _cleanup.Add(disposable);
            return disposable;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
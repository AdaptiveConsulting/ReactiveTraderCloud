using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using EventStore.ClientAPI;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriteServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        private readonly SerialDisposable _cleanup = new SerialDisposable();

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new Repository(conn, new EventTypeResolver(ReflectionHelper.ContractsAssembly)));
            var serviceStream = repositoryStream.LaunchOrKill(engine => new ReferenceWriteService(engine));
            _cleanup.Disposable =
                serviceStream.LaunchOrKill(brokerStream, (service, broker) => new ReferenceWriteServiceHost(service, broker)).Subscribe();

            return _cleanup;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
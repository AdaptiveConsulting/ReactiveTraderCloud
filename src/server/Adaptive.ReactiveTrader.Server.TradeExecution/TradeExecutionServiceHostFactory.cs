using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using EventStore.ClientAPI;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionServiceHostFactory : IServiceHostFactoryWithEventStore
    {
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new Repository(conn, new EventTypeResolver(ReflectionHelper.ContractsAssembly)));
            var idProvider = repositoryStream.LaunchOrKill(repo => new TradeIdProvider(repo));
            var engineStream = repositoryStream.LaunchOrKill(idProvider, (repo, id) => new TradeExecutionEngine(repo, id));
            var serviceStream = engineStream.LaunchOrKill(engine => new TradeExecutionService(engine));
            var disposable = serviceStream.LaunchOrKill(brokerStream, (service, broker) => new TradeExecutionServiceHost(service, broker)).Subscribe();

            _cleanup.Add(disposable);

            return disposable;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
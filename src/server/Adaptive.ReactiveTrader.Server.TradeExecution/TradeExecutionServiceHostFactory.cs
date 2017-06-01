using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using EventStore.ClientAPI;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore.EventHandling;
using Adaptive.ReactiveTrader.EventStore.Process;
using Adaptive.ReactiveTrader.Server.TradeExecution.Process;

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
            var eventTypeResolver = new EventTypeResolver(ReflectionHelper.ContractsAssembly);
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new AggregateRepository(conn, eventTypeResolver));
            var idProvider = repositoryStream.LaunchOrKill(repo => new TradeIdProvider(repo));
            var engineStream = repositoryStream.LaunchOrKill(idProvider, (repo, id) => new TradeExecutionEngine(repo, id));
            var serviceStream = engineStream.LaunchOrKill(engine => new TradeExecutionService(engine));
            var disposable = serviceStream.LaunchOrKill(brokerStream, (service, broker) => new TradeExecutionServiceHost(service, broker)).Subscribe();

            var tradeExecutionSubcription = eventStoreStream
                .LaunchOrKill(
                    conn =>
                    {
                        var eventDispatcher = new EventDispatcher(conn, eventTypeResolver);
                        var processRepo = new ProcessRepository(conn, eventTypeResolver);
                        var eventHandler = new TradeExecutionEventHandler(processRepo);

                        // TODO - revisit blocking here.
                        return eventDispatcher.Start("trade_execution", "trade_execution_group", eventHandler).Result;
                    })
                .Subscribe();

            var disposables = new CompositeDisposable(disposable, tradeExecutionSubcription);
            _cleanup.Add(disposables);

            return disposables;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
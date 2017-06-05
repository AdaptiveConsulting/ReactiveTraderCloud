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
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

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
            var idProviderStream = repositoryStream.LaunchOrKill(repo => new TradeIdProvider(repo));
            var serviceStream = repositoryStream.LaunchOrKill(idProviderStream,
                                                              (repository, idProvider) => new TradeExecutionService(repository, idProvider));

            var serviceHostSubscription = serviceStream
                .LaunchOrKill(brokerStream, (service, broker) => new TradeExecutionServiceHost(service, broker))
                .Subscribe();

            var tradeExecutionSubcription = eventStoreStream
                .LaunchOrKill(
                    repositoryStream,
                    (conn, repo) =>
                    {
                        const string streamName = "trade_execution";
                        const string groupName = "trade_execution_group";

                        var processRepository = new ProcessRepository(conn, eventTypeResolver);
                        var router = EventHandlers.GetRouter(processRepository, () => new TradeExecutionProcess(repo));

                        // TODO - revisit blocking here. Should we be returning Task<IDisposable>?
                        return EventDispatcher.Start(conn, eventTypeResolver, streamName, groupName, router).Result;
                    })
                .Subscribe();

            var disposables = new CompositeDisposable(serviceHostSubscription, tradeExecutionSubcription);
            _cleanup.Add(disposables);

            return disposables;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
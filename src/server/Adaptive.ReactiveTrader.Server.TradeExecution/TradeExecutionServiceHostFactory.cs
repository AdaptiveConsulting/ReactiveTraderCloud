using Adaptive.ReactiveTrader.Messaging;
using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionServiceHostFactory : IServceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<TradeExecutionServiceHostFactory>();
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();
        
        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            var repositoryStream = eventStoreStream.LaunchOrKill(conn => new Repository(conn));
            var idProvider = eventStoreStream.LaunchOrKill(conn => new TradeIdProvider(conn));
            var engineStream = repositoryStream.LaunchOrKill(idProvider, (repo, id) => new TradeExecutionEngine(repo, id));
            var serviceStream = engineStream.LaunchOrKill(engine => new TradeExecutionService(engine));
            var disposable = serviceStream.LaunchOrKill(brokerStream, (service, broker) => new TradeExecutionServiceHost(service, broker)).Subscribe();

            _cleanup.Add(disposable);

            return _cleanup;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
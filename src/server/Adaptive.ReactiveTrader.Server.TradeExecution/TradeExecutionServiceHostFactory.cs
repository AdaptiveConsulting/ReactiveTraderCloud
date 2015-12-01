using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;
using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionServiceHostFactory : IServiceHostFactory, IEventStoreConsumer, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<TradeExecutionServiceHostFactory>();

        private TradeExecutionService _service;
        private Repository _cache;
        private TradeExecutionEngine _executionEngine;

        public void Initialize(IEventStoreConnection es)
        {
            _cache = new Repository(es);
            _executionEngine = new TradeExecutionEngine(_cache, new TradeIdProvider(es));
            _service = new TradeExecutionService(_executionEngine);
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new TradeExecutionServiceHost(_service, broker));
        }

        public void Dispose()
        {

        }
    }
}
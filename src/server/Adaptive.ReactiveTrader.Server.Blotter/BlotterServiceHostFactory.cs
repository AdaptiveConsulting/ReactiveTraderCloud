using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHostFactory : IServiceHostFactory, IEventStoreConsumer, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<BlotterServiceHostFactory>();

        private BlotterService _service;
        private TradeCache _cache;

        public void Initialize(IEventStoreConnection es, IConnectionStatusMonitor monitor)
        {
            _cache = new TradeCache(es);
            _cache.Initialize();

            _service = new BlotterService(_cache.GetTrades());
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new BlotterServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }
    }
}
using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReadServiceHostFactory : IServiceHostFactory, IEventStoreConsumer, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataReadServiceHostFactory>();

        private ReferenceService _service;
        private CurrencyPairCache _cache;
    
        public void Initialize(IEventStoreConnection es)
        {
            _cache = new CurrencyPairCache(es);
            _cache.Initialize();

            _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new ReferenceReadServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }
    }
}
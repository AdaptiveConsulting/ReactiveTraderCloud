using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Blotter;
using Common.Logging;
using EventStore.ClientAPI;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.EventStore;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHostFactory : IServiceHostFactory, IEventStoreConsumer, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHostFactory>();

        private AnalyticsService _service;
        private TradeCache _cache;

        public void Initialize(IEventStoreConnection es)
        {
            _cache = new TradeCache(es);
            _cache.Initialize();

            // todo: decide what trades to keep for analytics
            // just today's trades? in which case needs to restart svc every day etc
            var doneTrades = _cache.GetTrades()
                .SelectMany(t => t.Trades)
                .Where(t => t.Status == TradeStatusDto.Done);

            _service = new AnalyticsService(doneTrades);
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new AnalyticsServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }
    }
}
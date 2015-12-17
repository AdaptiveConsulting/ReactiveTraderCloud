using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHostFactory>();
        private TradeCache _cache;

        private AnalyticsService _service;

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return null;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            _cache = new TradeCache(eventStoreStream);

            var analyticsEngine = new AnalyticsEngine();

            _service = new AnalyticsService(analyticsEngine);

            return brokerStream.LaunchOrKill(broker => new AnalyticsServiceHost(_service, broker, _cache))
                               .Subscribe();
        }
    }
}
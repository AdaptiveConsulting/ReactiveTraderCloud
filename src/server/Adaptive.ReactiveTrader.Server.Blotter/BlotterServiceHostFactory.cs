using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHostFactory : IServiceHostFactoryWithEventStore
    {
        private TradeCache _cache;
        private BlotterService _service;

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            _cache = new TradeCache(eventStoreStream);
            _service = new BlotterService(_cache.GetTrades());
            return brokerStream.LaunchOrKill(broker => new BlotterServiceHost(_service, broker)).Subscribe();
        }
    }
}

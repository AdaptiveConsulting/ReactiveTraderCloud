using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReadServiceHostFactory : IServiceHostFactoryWithEventStore
    {
        private CurrencyPairCache _cache;
        private ReferenceService _service;

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream,
                                      IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            _cache = new CurrencyPairCache(eventStoreStream);
            _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
            return brokerStream.LaunchOrKill(broker => new ReferenceReadServiceHost(_service, broker))
                                         .Subscribe();
        }
    }
}

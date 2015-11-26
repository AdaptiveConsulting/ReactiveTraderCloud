using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.EventStore;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class TradeCache : IDisposable
    {
        private readonly IEventStore _eventStore;

        public TradeCache(IEventStore eventStore)
        {
            _eventStore = eventStore;
        }

        public void Initialize()
        {
            
        }

        public IObservable<TradesDto> GetTrades()
        {
            return Observable.Return(new TradesDto());
        }

        public void Dispose()
        {
            
        }
    }

    public class TradesDto
    {
    }
}

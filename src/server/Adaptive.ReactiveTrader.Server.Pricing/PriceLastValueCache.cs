using System;
using System.Collections.Concurrent;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceLastValueCache : IPriceLastValueCache
    {
        private readonly ConcurrentDictionary<string, PriceDto> _lastValueCache = new ConcurrentDictionary<string, PriceDto>();

        public PriceDto GetLastValue(string currencyPair)
        {
            PriceDto price;
            if (_lastValueCache.TryGetValue(currencyPair, out price))
            {
                return price;
            }
            throw new InvalidOperationException($"Currency pair {currencyPair} has not been initialized in last value cache");
        }

        public void StoreLastValue(PriceDto price)
        {
            _lastValueCache.AddOrUpdate(price.Symbol, _ => price, (s, p) => price);
        }
    }
}
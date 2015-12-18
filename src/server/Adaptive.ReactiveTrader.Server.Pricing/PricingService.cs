using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingService : IPricingService
    {
        private readonly PriceSource _source;

        public PricingService(PriceSource source)
        {
            _source = source;
        }

        public IObservable<SpotPriceDto> GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request)
        {
            return _source.GetPriceStream(request.symbol);
        }

        public IObservable<SpotPriceDto> GetAllPriceUpdates()
        {
            return _source.GetAllPricesStream();
        }
    }
}
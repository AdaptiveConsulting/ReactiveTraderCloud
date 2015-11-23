using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPricingService
    {
        IObservable<SpotPriceDto> GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request);
    }
}
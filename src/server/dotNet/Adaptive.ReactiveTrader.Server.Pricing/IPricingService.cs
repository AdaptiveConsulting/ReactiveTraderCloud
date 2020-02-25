using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPricingService
    {
        IObservable<SpotPriceDto> GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request);
        IObservable<SpotPriceDto> GetAllPriceUpdates();
    }
}
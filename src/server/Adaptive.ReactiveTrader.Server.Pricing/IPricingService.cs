using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPricingService
    {
        IDisposable GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request, IObserver<SpotPriceDto> streamHandler);
    }
}
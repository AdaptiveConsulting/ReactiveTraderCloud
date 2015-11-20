using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal interface IPricingService
    {
        IDisposable GetPriceUpdates(IRequestContext context, GetSpotStreamRequestDto request, IObserver<SpotPriceDto> streamHandler);
    }
}
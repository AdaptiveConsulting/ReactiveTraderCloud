using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IReferenceService
    {
        IDisposable GetCurrencyPairUpdatesStream(RequestContext context, NothingDto request,
            IObserver<CurrencyPairUpdatesDto> streamHandler);
    }
}
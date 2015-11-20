using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IReferenceService
    {
        IDisposable GetCurrencyPairUpdatesStream(IRequestContext context, NothingDto request, IObserver<CurrencyPairUpdatesDto> streamHandler);
    }
}
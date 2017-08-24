using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public interface IReferenceService
    {
        IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdatesStream(IRequestContext context, NothingDto request);
    }
}
using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface Repository
    {
        IObservable<CurrencyPairUpdatesDto> GetCurrencyUpdateStream();
    }
}
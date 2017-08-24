using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData
{
    public interface ICurrencyPair
    {
        string Symbol { get; }
        IObservable<IPrice> PriceStream { get; }
        int RatePrecision { get; }
        int PipsPosition { get; }
        string BaseCurrency { get; }
        string CounterCurrency { get; }
    }
}

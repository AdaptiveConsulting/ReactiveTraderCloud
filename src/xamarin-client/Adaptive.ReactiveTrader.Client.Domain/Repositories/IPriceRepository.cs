using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    interface IPriceRepository
    {
        IObservable<IPrice> GetPriceStream(ICurrencyPair currencyPair);
    }
}
using System;
using System.Collections.Generic;
using System.Reactive;
using Adaptive.ReactiveTrader.Shared.DTO.Control;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    public interface IControlRepository
    {
        IObservable<Unit> SetPriceFeedThroughput(double throughput);
        IObservable<double> GetPriceFeedThroughput();
        IObservable<IEnumerable<CurrencyPairStateDto>> GetCurrencyPairStates();
        IObservable<Unit> SetCurrencyPairState(string symbol, bool enabled, bool stale);
    }
}
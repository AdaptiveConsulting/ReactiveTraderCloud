using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.Extensions;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Pricing
{
    public interface IExecutablePrice
    {
        IObservable<IStale<ITrade>> ExecuteRequest(long notional, string dealtCurrency);
        Direction Direction { get; }
        IPrice Parent { get; }
        decimal Rate { get; }
    }
}

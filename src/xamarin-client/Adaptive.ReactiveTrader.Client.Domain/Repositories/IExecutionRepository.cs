using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Shared.Extensions;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    interface IExecutionRepository
    {
        IObservable<IStale<ITrade>> ExecuteRequest(IExecutablePrice executablePrice, long notional, string dealtCurrency);
    }
}
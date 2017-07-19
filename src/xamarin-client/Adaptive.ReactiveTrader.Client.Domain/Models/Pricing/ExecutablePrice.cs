using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;
using Adaptive.ReactiveTrader.Shared.Extensions;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Pricing
{
    internal class ExecutablePrice : IExecutablePrice
    {
        private readonly IExecutionRepository _executionRepository;

        public ExecutablePrice(Direction direction, decimal rate, IExecutionRepository executionRepository)
        {
            _executionRepository = executionRepository;
            Direction = direction;
            Rate = rate;
        }

        public IObservable<IStale<ITrade>> ExecuteRequest(long notional, string dealtCurrency)
        {
            return _executionRepository.ExecuteRequest(this, notional, dealtCurrency);
        }

        public Direction Direction { get; }
        public decimal Rate { get; }
        public IPrice Parent { get; internal set; }
    }
}
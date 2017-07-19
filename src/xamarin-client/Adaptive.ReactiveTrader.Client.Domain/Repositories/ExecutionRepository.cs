using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;
using Adaptive.ReactiveTrader.Shared.DTO.Execution;
using Adaptive.ReactiveTrader.Shared.Extensions;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    internal class ExecutionRepository : IExecutionRepository
    {
        private readonly IExecutionServiceClient _executionServiceClient;
        private readonly ITradeFactory _tradeFactory;
        private readonly IConcurrencyService _concurrencyService;

        public ExecutionRepository(IExecutionServiceClient executionServiceClient, ITradeFactory tradeFactory, IConcurrencyService concurrencyService)
        {
            _executionServiceClient = executionServiceClient;
            _tradeFactory = tradeFactory;
            _concurrencyService = concurrencyService;
        }

        public IObservable<IStale<ITrade>> ExecuteRequest(IExecutablePrice executablePrice, long notional, string dealtCurrency)
        {
            return Observable.Defer(() =>
            {
                var price = executablePrice.Parent;

                var request = new ExecuteTradeRequestDto
                {
                    Direction = executablePrice.Direction == Direction.BUY ? DirectionDto.Buy : DirectionDto.Sell,
                    Notional = notional,
                    SpotRate = executablePrice.Rate,
                    CurrencyPair = price.CurrencyPair.Symbol,
                    ValueDate = price.ValueDate.ToString("u"),
                    DealtCurrency = dealtCurrency
                };

                return _executionServiceClient.ExecuteRequest(request)
                    .Select(_tradeFactory.Create)
                    .DetectStale(TimeSpan.FromSeconds(2), _concurrencyService.TaskPool);
            });
        }
    }
}
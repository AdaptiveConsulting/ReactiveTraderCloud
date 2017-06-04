using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers
{
    public class ExecuteTradeCommandHandler : IDisposable
    {
        private readonly IAggregateRepository _repository;
        private readonly TradeIdProvider _tradeIdProvider;

        public ExecuteTradeCommandHandler(IAggregateRepository repository, TradeIdProvider tradeIdProvider)
        {
            _repository = repository;
            _tradeIdProvider = tradeIdProvider;
        }

        public void Dispose()
        {
            // Nothing to do.
        }

        public async Task<ExecuteTradeResponseDto> HandleAsync(ExecuteTradeRequestDto request, string user)
        {
            var id = (await _tradeIdProvider.GetNextId()).ToString();
            var tradeDate = DateTime.UtcNow;

            DateTime valueDate;
            if (!DateTime.TryParse(request.ValueDate, out valueDate))
            {
                valueDate = DateTime.UtcNow.AddDays(2).Date.ToWeekday();
            }

            var trade = new Trade(id,
                                  user,
                                  request.CurrencyPair,
                                  request.SpotRate,
                                  tradeDate,
                                  valueDate,
                                  request.Direction,
                                  request.Notional,
                                  request.DealtCurrency);

            await _repository.SaveAsync(trade);

            return new ExecuteTradeResponseDto
            {
                Trade = new TradeDto
                {
                    CurrencyPair = trade.CurrencyPair,
                    Direction = trade.Direction,
                    Notional = trade.Notional,
                    SpotRate = trade.SpotRate,
                    Status = trade.State,
                    TradeDate = tradeDate,
                    ValueDate = valueDate,
                    TradeId = id,
                    TraderName = user,
                    DealtCurrency = trade.DealtCurrency
                }
            };
        }
    }
}
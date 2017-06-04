using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Commands;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers
{
    public class CompleteTradeCommandHandler
    {
        private readonly IAggregateRepository _aggregateRepository;

        public CompleteTradeCommandHandler(IAggregateRepository aggregateRepository)
        {
            _aggregateRepository = aggregateRepository;
        }

        public async Task HandleAsync(CompleteTradeCommand command)
        {
            var trade = await _aggregateRepository.GetByIdAsync<Trade>(command.TradeId);
            trade.Complete();
            await _aggregateRepository.SaveAsync(trade);
        }
    }
}
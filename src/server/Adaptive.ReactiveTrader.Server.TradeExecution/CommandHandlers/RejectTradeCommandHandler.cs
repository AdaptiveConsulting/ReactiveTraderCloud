using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Commands;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers
{
    public class RejectTradeCommandHandler
    {
        private readonly IAggregateRepository _aggregateRepository;

        public RejectTradeCommandHandler(IAggregateRepository aggregateRepository)
        {
            _aggregateRepository = aggregateRepository;
        }

        public async Task HandleAsync(RejectTradeCommand command)
        {
            var trade = await _aggregateRepository.GetByIdAsync<Trade>(command.TradeId);
            trade.Reject(command.Reason);
            await _aggregateRepository.SaveAsync(trade);
        }
    }
}
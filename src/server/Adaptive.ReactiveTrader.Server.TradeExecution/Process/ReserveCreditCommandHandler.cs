using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class ReserveCreditCommandHandler : IReserveCreditCommandHandler
    {
        private readonly IAggregateRepository _aggregateRepository;

        public ReserveCreditCommandHandler(IAggregateRepository aggregateRepository)
        {
            _aggregateRepository = aggregateRepository;
        }

        public async Task HandleAsync(ReserveCreditCommand command)
        {
            var creditAccount = await _aggregateRepository.GetByIdOrCreateAsync<CreditAccount>(command.AccountName);

            // If this credit account doesn't exist yet, create it.
            // In the real world, there would be some other mechanism for creating a credit account,
            // and we wouldn't create one here. If there was no existing acount, an appropriate event
            // could be raised which would go through the TradeExecutionProcess, which in turn could
            // reject the trade.
            if (creditAccount.Version == -1)
            {
                creditAccount.Create(command.AccountName);
            }

            // TODO - add more params here
            creditAccount.ReserveCredit(command.TradeId);

            await _aggregateRepository.SaveAsync(creditAccount);
        }
    }
}
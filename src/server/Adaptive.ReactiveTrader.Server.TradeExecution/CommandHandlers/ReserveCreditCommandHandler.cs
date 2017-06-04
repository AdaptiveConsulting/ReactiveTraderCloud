using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.TradeExecution.Commands;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers
{
    public class ReserveCreditCommandHandler
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

            // Emulate some variable delays based on currency pair.
            switch (command.TradeDetails.CurrencyPair)
            {
                case "EURJPY":
                    // TODO - 5 seconds should cause a timeout, but this currently doesn't work due to process manager changes.
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    break;
                case "GBPUSD":
                    await Task.Delay(TimeSpan.FromSeconds(1.5));
                    break;
                default:
                    await Task.Delay(TimeSpan.FromSeconds(.5));
                    break;
            }

            creditAccount.ReserveCredit(command.TradeDetails);

            await _aggregateRepository.SaveAsync(creditAccount);
        }
    }
}
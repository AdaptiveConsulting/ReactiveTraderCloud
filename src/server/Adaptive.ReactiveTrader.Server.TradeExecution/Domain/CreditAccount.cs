using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class CreditAccount : AggregateBase
    {
        public override string StreamPrefix { get; } = "creditAccount-";
        public override string Identifier => $"{StreamPrefix}{AccountName}";
        public string AccountName { get; private set; }

        public void Create(string accountName)
        {
            RaiseEvent(new CreditAccountCreatedEvent(accountName));
        }

        public void ReserveCredit(TradeDetails tradeDetails)
        {
            // Emulate a credit limit breach if currency pair is GBPJPY.
            if (tradeDetails.CurrencyPair == "GBPJPY")
            {
                RaiseEvent(new CreditLimitBreachedEvent(AccountName, tradeDetails.TradeId));
            }
            else
            {
                RaiseEvent(new CreditReservedEvent(AccountName, tradeDetails.TradeId));
            }
        }

        public void Apply(CreditAccountCreatedEvent @event)
        {
            AccountName = @event.AccountName;
        }

        public void Apply(CreditReservedEvent @event)
        {
            // TODO
        }

        public void Apply(CreditLimitBreachedEvent @event)
        {
            // TODO
        }
    }
}
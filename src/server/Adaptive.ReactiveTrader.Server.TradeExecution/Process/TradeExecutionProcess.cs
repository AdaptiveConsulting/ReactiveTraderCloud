using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Process;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class TradeExecutionProcess : ProcessBase
    {
        public override object Identifier => $"tradeExecution-{Id}";

        public long Id { get; private set; }

        public void OnEvent(TradeCreatedEvent @event)
        {
            Id = @event.TradeId;
            // TODO - dispatch ReserveCreditCommand
        }

        public void OnEvent(CreditReservedEvent @event)
        {
            // TODO - dispatch CompleteTradeCommand
        }

        public void OnEvent(CreditLimitBreachedEvent @event)
        {
            // TODO - dispatch RejectTradeCommand
        }
    }
}
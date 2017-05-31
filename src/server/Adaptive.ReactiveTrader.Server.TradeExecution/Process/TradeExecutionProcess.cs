using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Process;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class TradeExecutionProcess : ProcessBase
    {
        public override object Identifier => "TODO";

        public void Transition(TradeCreatedEvent @event)
        {
            // TODO - dispatch ReserveCreditCommand
        }

        public void Transition(CreditReservedEvent @event)
        {
            // TODO - dispatch CompleteTradeCommand
        }

        public void Transition(CreditLimitBreachedEvent @event)
        {
            // TODO - dispatch RejectTradeCommand
        }
    }
}
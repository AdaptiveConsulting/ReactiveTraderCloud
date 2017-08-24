using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class TradeId : AggregateBase
    {
        public static readonly string IdentifierString = "TradeIdentifier";
        public override object Identifier => IdentifierString;

        public void IncrementId()
        {
            RaiseEvent(new TradeIdIncrementedEvent());
        }

        public void Apply(TradeIdIncrementedEvent evt)
        {
        }
    }
}
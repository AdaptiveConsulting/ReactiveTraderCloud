using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class TradeId : AggregateBase
    {
        public override string StreamPrefix { get; } = "TradeIdentifier";
        public override string Identifier => StreamPrefix;

        public void IncrementId()
        {
            RaiseEvent(new TradeIdIncrementedEvent());
        }

        public void Apply(TradeIdIncrementedEvent evt)
        {
        }
    }
}
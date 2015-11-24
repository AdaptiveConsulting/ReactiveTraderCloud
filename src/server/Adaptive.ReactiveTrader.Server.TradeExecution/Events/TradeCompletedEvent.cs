namespace Adaptive.ReactiveTrader.Server.TradeExecution.Events
{
    public class TradeCompletedEvent
    {
        public long TradeId { get; }

        public TradeCompletedEvent(long tradeId)
        {
            TradeId = tradeId;
        }
    }
}
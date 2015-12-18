namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeCompletedEvent
    {
        public TradeCompletedEvent(long tradeId)
        {
            TradeId = tradeId;
        }

        public long TradeId { get; }
    }
}
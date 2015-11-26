namespace Adaptive.ReactiveTrader.Contract.Events.Trade
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
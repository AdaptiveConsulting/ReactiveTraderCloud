namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeCompletedEvent
    {
        public static string Type { get; } = "Trade Completed";
        public long TradeId { get; }

        public TradeCompletedEvent(long tradeId)
        {
            TradeId = tradeId;
        }
    }
}
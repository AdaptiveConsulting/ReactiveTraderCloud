namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeRejectedEvent
    {
        public static string Type { get; } = "Trade Rejected";
        public long TradeId { get; }
        public string Reason { get; }

        public TradeRejectedEvent(long tradeId, string reason)
        {
            TradeId = tradeId;
            Reason = reason;
        }
    }
}
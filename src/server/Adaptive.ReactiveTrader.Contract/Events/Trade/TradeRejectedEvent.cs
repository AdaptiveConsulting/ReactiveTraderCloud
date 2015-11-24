namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeRejectedEvent
    {
        public long TradeId { get; }
        public string Reason { get; }

        public TradeRejectedEvent(long tradeId, string reason)
        {
            TradeId = tradeId;
            Reason = reason;
        }
    }
}
namespace Adaptive.ReactiveTrader.Server.TradeExecution.Events
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
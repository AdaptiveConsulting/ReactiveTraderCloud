namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class RejectTradeCommand
    {
        public RejectTradeCommand(string tradeId, string reason)
        {
            TradeId = tradeId;
            Reason = reason;
        }

        public string TradeId { get; }
        public string Reason { get; }
    }
}
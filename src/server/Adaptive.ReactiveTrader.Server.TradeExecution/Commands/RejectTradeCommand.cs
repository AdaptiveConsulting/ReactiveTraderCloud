namespace Adaptive.ReactiveTrader.Server.TradeExecution.Commands
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
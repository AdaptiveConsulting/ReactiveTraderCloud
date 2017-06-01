namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class CompleteTradeCommand
    {
        public CompleteTradeCommand(string tradeId)
        {
            TradeId = tradeId;
        }

        public string TradeId { get; }
    }
}
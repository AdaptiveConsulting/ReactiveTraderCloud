namespace Adaptive.ReactiveTrader.Server.TradeExecution.Commands
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
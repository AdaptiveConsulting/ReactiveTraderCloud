namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class ReserveCreditCommand
    {
        public ReserveCreditCommand(string accountName, string tradeId)
        {
            AccountName = accountName;
            TradeId = tradeId;
        }

        public string AccountName { get; }
        public string TradeId { get; }
    }
}
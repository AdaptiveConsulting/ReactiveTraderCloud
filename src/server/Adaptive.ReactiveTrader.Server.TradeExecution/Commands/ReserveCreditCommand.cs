using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Commands
{
    public class ReserveCreditCommand
    {
        public ReserveCreditCommand(string accountName, TradeDetails tradeDetails)
        {
            AccountName = accountName;
            TradeDetails = tradeDetails;
        }

        public string AccountName { get; }
        public TradeDetails TradeDetails { get; }
    }
}
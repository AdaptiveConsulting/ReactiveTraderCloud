using System.Threading;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeIdProvider
    {
        private long _tradeId;

        public long GetNextId()
        {
            return Interlocked.Increment(ref _tradeId);
        }
    }
}
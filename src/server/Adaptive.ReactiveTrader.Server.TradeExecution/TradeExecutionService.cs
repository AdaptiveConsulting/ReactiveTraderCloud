using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionService : ITradeExecutionService, IDisposable
    {
        private static readonly ILog Log = LogManager.GetLogger<TradeExecutionService>();
        private readonly TradeExecutionEngine _executionEngine;

        public TradeExecutionService(TradeExecutionEngine executionEngine)
        {
            _executionEngine = executionEngine;
        }

        public void Dispose()
        {
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request)
        {
            Log.DebugFormat("[REQ. RESPONSE] Executing Trade: ({0})", context.UserSession.Username);
            return _executionEngine.ExecuteAsync(request, context.UserSession.Username);
        }
    }
}
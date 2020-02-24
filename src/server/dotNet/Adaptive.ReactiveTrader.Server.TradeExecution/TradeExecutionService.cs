using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionService : ITradeExecutionService, IDisposable
    {
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
            Log.Debug("[REQ. RESPONSE] Executing Trade: ({username})", context.UserSession.Username);
            return _executionEngine.ExecuteAsync(request, context.UserSession.Username);
        }
    }
}

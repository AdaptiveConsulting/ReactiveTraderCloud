using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public interface ITradeExecutionService
    {
        Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request);
    }

    public class TradeExecutionService : ITradeExecutionService, IDisposable
    {
        private static readonly ILog Log = LogManager.GetLogger<TradeExecutionService>();
        private readonly TradeExecutionEngine _executionEngine;

        public TradeExecutionService(TradeExecutionEngine executionEngine)
        {
            _executionEngine = executionEngine;
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request)
        {
            Log.DebugFormat("[REQ. STREAM] subscribed: ({0})", context.UserSession.Username);
            return _executionEngine.ExecuteAsync(request, context.UserSession.Username);
        }

        public void Dispose()
        {
        }
    }
}
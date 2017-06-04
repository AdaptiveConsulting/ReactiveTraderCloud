using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionService : ITradeExecutionService, IDisposable
    {
        //private static readonly ILogger Log = Log.ForContext<TradeExecutionService>();
        private readonly ExecuteTradeCommandHandler _commandHandler;

        public TradeExecutionService(ExecuteTradeCommandHandler commandHandler)
        {
            _commandHandler = commandHandler;
        }

        public void Dispose()
        {
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request)
        {
            Log.Debug("[REQ. RESPONSE] Executing Trade: ({username})", context.UserSession.Username);
            return _commandHandler.HandleAsync(request, context.UserSession.Username);
        }
    }
}
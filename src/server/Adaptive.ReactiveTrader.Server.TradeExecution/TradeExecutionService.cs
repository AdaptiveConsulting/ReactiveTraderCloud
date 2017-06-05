using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionService : ITradeExecutionService, IDisposable
    {
        private readonly IAggregateRepository _repository;
        private readonly TradeIdProvider _idProvider;

        public TradeExecutionService(IAggregateRepository repository, TradeIdProvider idProvider)
        {
            _repository = repository;
            _idProvider = idProvider;
        }

        public void Dispose()
        {
        }

        public Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request)
        {
            Log.Debug("[REQ. RESPONSE] Executing Trade: ({username})", context.UserSession.Username);
            return CommandHandlers.HandleAsync(request, context.UserSession.Username, _repository, _idProvider);
        }
    }
}
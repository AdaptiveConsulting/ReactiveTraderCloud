using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public interface ITradeExecutionService
    {
        Task<ExecuteTradeResponseDto> ExecuteTrade(IRequestContext context, ExecuteTradeRequestDto request);
    }
}
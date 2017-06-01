using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public interface IRejectTradeCommandHandler
    {
        Task HandleAsync(RejectTradeCommand command);
    }
}
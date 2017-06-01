using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public interface ICompleteTradeCommandHandler
    {
        Task HandleAsync(CompleteTradeCommand command);
    }
}
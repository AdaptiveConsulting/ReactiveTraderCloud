using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public interface IReserveCreditCommandHandler
    {
        Task HandleAsync(ReserveCreditCommand command);
    }
}
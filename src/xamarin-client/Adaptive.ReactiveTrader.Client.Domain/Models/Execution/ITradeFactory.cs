using Adaptive.ReactiveTrader.Shared.DTO.Execution;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Execution
{
    interface ITradeFactory
    {
        ITrade Create(TradeDto trade);
    }
}
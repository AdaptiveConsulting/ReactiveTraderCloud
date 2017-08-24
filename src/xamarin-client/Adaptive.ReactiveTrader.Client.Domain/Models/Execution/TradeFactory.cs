using Adaptive.ReactiveTrader.Shared.DTO.Execution;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Execution
{
    internal class TradeFactory : ITradeFactory
    {
        public ITrade Create(TradeDto trade)
        {
            return new Trade(
                trade.CurrencyPair,
                trade.Direction == DirectionDto.Buy ? Direction.BUY : Direction.SELL,
                trade.Notional,
                trade.DealtCurrency,
                trade.SpotRate,
                trade.Status == TradeStatusDto.Done ? TradeStatus.Done : TradeStatus.Rejected,
                trade.TradeDate,
                trade.TradeId,
                trade.TraderName,
                trade.ValueDate);
        }
    }
}
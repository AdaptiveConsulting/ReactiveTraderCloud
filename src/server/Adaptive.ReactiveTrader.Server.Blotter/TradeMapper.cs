using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Common;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public static class TradeMapper
    {
        public static TradeDto ToDto(this Trade t)
        {
            return new TradeDto
            {
                TradeId = t.TradeId,
                TraderName = t.TraderName,
                CurrencyPair = t.CurrencyPair,
                Notional = t.Notional,
                DealtCurrency = t.DealtCurrency,
                Direction = t.Direction,
                SpotRate = t.SpotRate,
                TradeDate = t.TradeDate,
                ValueDate = t.ValueDate,
                Status = t.Status
            };
        }
    }
}

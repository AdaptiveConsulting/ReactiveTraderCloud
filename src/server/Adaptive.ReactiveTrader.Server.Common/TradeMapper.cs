using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Host
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
                ValueDate = "SP. " + t.ValueDate.Day + " " + t.ValueDate.ToString("MMM"),
                Status = t.Status
            };
        }
    }
}
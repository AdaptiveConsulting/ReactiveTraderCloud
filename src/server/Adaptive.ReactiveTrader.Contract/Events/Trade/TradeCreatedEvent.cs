namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeCreatedEvent
    {
        public TradeCreatedEvent(long tradeId,
                                 string traderName,
                                 string currencyPair,
                                 decimal spotRate,
                                 string tradeDate,
                                 string valueDate,
                                 string direction,
                                 int notional,
                                 string dealtCurrency)
        {
            TradeId = tradeId;
            TraderName = traderName;
            CurrencyPair = currencyPair;
            SpotRate = spotRate;
            TradeDate = tradeDate;
            ValueDate = valueDate;
            Direction = direction;
            Notional = notional;
            DealtCurrency = dealtCurrency;
        }

        public long TradeId { get; }
        public string TraderName { get; }
        public string CurrencyPair { get; }
        public decimal SpotRate { get; }
        public string TradeDate { get; }
        public string ValueDate { get; }
        public string Direction { get; }
        public int Notional { get; }
        public string DealtCurrency { get; }
    }
}
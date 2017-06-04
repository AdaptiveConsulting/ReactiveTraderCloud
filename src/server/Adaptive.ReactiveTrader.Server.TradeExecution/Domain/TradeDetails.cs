using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class TradeDetails
    {
        public TradeDetails(string tradeId,
                            string currencyPair,
                            decimal spotRate,
                            DateTime tradeDate,
                            DateTime valueDate,
                            DirectionDto direction,
                            decimal notional,
                            string dealtCurrency)
        {
            TradeId = tradeId;
            CurrencyPair = currencyPair;
            SpotRate = spotRate;
            TradeDate = tradeDate;
            ValueDate = valueDate;
            Direction = direction;
            Notional = notional;
            DealtCurrency = dealtCurrency;
        }

        public string TradeId { get; }
        public string CurrencyPair { get; }
        public decimal SpotRate { get; }
        public DateTime TradeDate { get; }
        public DateTime ValueDate { get; }
        public DirectionDto Direction { get; }
        public decimal Notional { get; }
        public string DealtCurrency { get; }
    }
}
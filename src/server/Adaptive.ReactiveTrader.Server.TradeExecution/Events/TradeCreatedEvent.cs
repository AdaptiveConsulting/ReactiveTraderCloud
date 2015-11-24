using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Events
{
    public class TradeCreatedEvent
    {
        public long TradeId { get; }
        public string CurrencyPair { get; }
        public decimal SpotRate { get; }
        public DateTime TradeDate { get; }
        public DateTime ValueDate { get; }
        public DirectionDto Direction { get; }
        public int Notional { get; }
        public string DealtCurrency { get; }

        public TradeCreatedEvent(long tradeId, string currencyPair, decimal spotRate, DateTime tradeDate, DateTime valueDate, DirectionDto direction, int notional, string dealtCurrency)
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
    }
}
using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public class Trade
    {
        public Trade(
            long tradeId,
            string traderName,
            string currencyPair,
            decimal notional,
            string dealtCurrency,
            DirectionDto direction,
            decimal spotRate,
            DateTimeOffset tradeDate,
            DateTimeOffset valueDate,
            TradeStatusDto status)
        {
            TradeId = tradeId;
            TraderName = traderName;
            CurrencyPair = currencyPair;
            Notional = notional;
            DealtCurrency = dealtCurrency;
            Direction = direction;
            SpotRate = spotRate;
            TradeDate = tradeDate;
            ValueDate = valueDate;
            Status = status;
        }

        public long TradeId { get; }
        public string TraderName { get; }
        public string CurrencyPair { get; }
        public decimal Notional { get; }
        public string DealtCurrency { get; }
        public DirectionDto Direction { get; }
        public decimal SpotRate { get; }
        public DateTimeOffset TradeDate { get; }
        public DateTimeOffset ValueDate { get; }
        public TradeStatusDto Status { get; set; }

        public override string ToString()
        {
            return
                $"TradeId: {TradeId}, TraderName: {TraderName}, CurrencyPair: {CurrencyPair}, Notional: {Notional}, Direction: {Direction}, SpotRate: {SpotRate}, TradeDate: {TradeDate}, ValueDate: {ValueDate}, Status: {Status}, DealtCurrency: {DealtCurrency}";
        }
    }
}

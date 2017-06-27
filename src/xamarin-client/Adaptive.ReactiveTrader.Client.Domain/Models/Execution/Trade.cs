using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Execution
{
    internal class Trade : ITrade
    {
        public string CurrencyPair { get; }
        public Direction Direction { get; }
        public long Notional { get; }
        public decimal SpotRate { get; }
        public TradeStatus TradeStatus { get; }
        public DateTime TradeDate { get; }
        public long TradeId { get; }
        public string TraderName { get; }
        public DateTime ValueDate { get; }
        public string DealtCurrency { get; }

        public Trade(string currencyPair, Direction direction, long notional, string dealtCurrency, decimal spotRate, TradeStatus tradeStatus, DateTime tradeDate, long tradeId, string traderName, DateTime valueDate)
        {
            CurrencyPair = currencyPair;
            Direction = direction;
            Notional = notional;
            SpotRate = spotRate;
            TradeStatus = tradeStatus;
            TradeDate = tradeDate;
            TradeId = tradeId;
            TraderName = traderName;
            ValueDate = valueDate;
            DealtCurrency = dealtCurrency;
        }

        public override string ToString()
        {
            return
                $"CurrencyPair: {CurrencyPair}, Direction: {Direction}, Notional: {Notional}, SpotRate: {SpotRate}, TradeStatus: {TradeStatus}, TradeDate: {TradeDate}, TradeId: {TradeId}, TraderName: {TraderName}, ValueDate: {ValueDate}, DealtCurrency: {DealtCurrency}";
        }
    }
}
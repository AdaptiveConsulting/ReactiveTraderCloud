using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Execution
{
    internal class Trade : ITrade
    {
        public string CurrencyPair { get; private set; }
        public Direction Direction { get; private set; }
        public long Notional { get; private set; }
        public decimal SpotRate { get; private set; }
        public TradeStatus TradeStatus { get; private set; }
        public DateTime TradeDate { get; private set; }
        public long TradeId { get; private set; }
        public string TraderName { get; private set; }
        public DateTime ValueDate { get; private set; }
        public string DealtCurrency { get; private set; }

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
            return string.Format("CurrencyPair: {0}, Direction: {1}, Notional: {2}, SpotRate: {3}, TradeStatus: {4}, TradeDate: {5}, TradeId: {6}, TraderName: {7}, ValueDate: {8}, DealtCurrency: {9}", CurrencyPair, Direction, Notional, SpotRate, TradeStatus, TradeDate, TradeId, TraderName, ValueDate, DealtCurrency);
        }
    }
}
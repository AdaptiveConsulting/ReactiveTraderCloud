using System;

namespace Adaptive.ReactiveTrader.Contract
{
    public class TradeDto
    {
        public long TradeId { get; set; }
        public string TraderName { get; set; }
        public string CurrencyPair { get; set; }
        public long Notional { get; set; }
        public string DealtCurrency { get; set; }
        public DirectionDto Direction { get; set; }
        public decimal SpotRate { get; set; }
        public DateTime TradeDate { get; set; }
        public DateTime ValueDate { get; set; }
        public TradeStatusDto Status { get; set; }

        public override string ToString()
        {
            return string.Format("TradeId: {0}, TraderName: {1}, CurrencyPair: {2}, Notional: {3}, Direction: {4}, SpotRate: {5}, TradeDate: {6}, ValueDate: {7}, Status: {8}, DealtCurrency: {9}", TradeId, TraderName, CurrencyPair, Notional, Direction, SpotRate, TradeDate, ValueDate, Status, DealtCurrency);
        }
    }
}
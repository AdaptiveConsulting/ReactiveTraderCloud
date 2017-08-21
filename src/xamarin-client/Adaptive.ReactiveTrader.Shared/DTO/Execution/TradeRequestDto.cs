using System;

namespace Adaptive.ReactiveTrader.Shared.DTO.Execution
{
    public class TradeRequestDto
    {
        public string Symbol { get; set; }
        public decimal SpotRate { get; set; }
        public DateTime ValueDate { get; set; }
        public DirectionDto Direction { get; set; }
        public long Notional { get; set; }
        public string DealtCurrency { get; set; }

        public override string ToString()
        {
            return string.Format("Symbol: {0}, SpotRate: {1}, ValueDate: {2}, Direction: {3}, Notional: {4}, DealtCurrency: {5}", Symbol, SpotRate, ValueDate, Direction, Notional, DealtCurrency);
        }
    }
}
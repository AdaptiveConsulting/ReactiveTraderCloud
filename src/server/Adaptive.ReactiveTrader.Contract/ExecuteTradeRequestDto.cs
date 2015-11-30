using System;

namespace Adaptive.ReactiveTrader.Contract
{
    public class ExecuteTradeRequestDto
    {
        public string CurrencyPair { get; set; }
        public decimal SpotRate { get; set; }
        public string ValueDate { get; set; }
        public DirectionDto Direction { get; set; }
        public int Notional { get; set; }
        public string DealtCurrency { get; set; }
    }
}
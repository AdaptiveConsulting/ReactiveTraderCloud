﻿namespace Adaptive.ReactiveTrader.Shared.DTO.Analytics
{
    public class CurrencyPairPositionDto
    {
        public string Symbol { get; set; }
        public decimal BasePnl { get; set; }
        public decimal BaseTradedAmount { get; set; }

        public override string ToString()
        {
            return string.Format("Symbol: {0}, BasePnl: {1}, BaseTradedAmount: {2}", Symbol, BasePnl, BaseTradedAmount);
        }
    }
}
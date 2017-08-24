namespace Adaptive.ReactiveTrader.Contract
{
    public class CurrencyPairPositionDto
    {
        public string Symbol { get; set; }
        public decimal BasePnl { get; set; }
        public decimal BaseTradedAmount { get; set; }

        public override string ToString()
        {
            return $"Symbol: {Symbol}, BasePnl: {BasePnl}, BaseTradedAmount: {BaseTradedAmount}";
        }
    }
}
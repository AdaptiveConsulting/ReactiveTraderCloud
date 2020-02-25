namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class CurrencyPairPositionReport
    {
        public string Symbol { get; set; }
        public decimal BaseTradedAmount { get; set; }
        public decimal CounterTradedAmount { get; set; }
        public decimal BasePnl { get; set; }
        public decimal UsdPnl { get; set; }
        public bool WasTraded { get; set; }

        public override string ToString()
        {
            return $"Symbol: {Symbol}, BaseTradedAmount: {BaseTradedAmount}, CounterTradedAmount: {CounterTradedAmount}, BasePnl: {BasePnl}, UsdPnl: {UsdPnl}, WasTraded: {WasTraded}";
        }
    }
}

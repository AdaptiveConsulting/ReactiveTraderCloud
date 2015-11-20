namespace Adaptive.ReactiveTrader.Contract
{
    public class CurrencyPairDto
    {
        public CurrencyPairDto(string symbol, int ratePrecision, int pipsPosition)
        {
            Symbol = symbol;
            RatePrecision = ratePrecision;
            PipsPosition = pipsPosition;
        }

        public string Symbol { get; }
        public int RatePrecision { get; }
        public int PipsPosition { get; }

        public override string ToString()
        {
            return string.Format("Symbol: {0}, RatePrecision: {1}, PipsPosition: {2}", Symbol, RatePrecision,
                PipsPosition);
        }
    }
}
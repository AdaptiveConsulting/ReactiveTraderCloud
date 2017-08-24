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
            return $"Symbol: {Symbol}, RatePrecision: {RatePrecision}, PipsPosition: {PipsPosition}";
        }
    }
}
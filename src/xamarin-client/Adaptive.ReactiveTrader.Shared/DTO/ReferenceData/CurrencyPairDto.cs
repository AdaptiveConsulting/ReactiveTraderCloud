namespace Adaptive.ReactiveTrader.Shared.DTO.ReferenceData
{
    public class CurrencyPairDto
    {
        public CurrencyPairDto(string symbol, int ratePrecision, int pipsPosition)
        {
            Symbol = symbol;
            RatePrecision = ratePrecision;
            PipsPosition = pipsPosition;
        }

        public string Symbol { get; private set; }
        public int RatePrecision { get; private set; }
        public int PipsPosition { get; private set; }

        public override string ToString()
        {
            return string.Format("Symbol: {0}, RatePrecision: {1}, PipsPosition: {2}", Symbol, RatePrecision, PipsPosition);
        }
    }
}
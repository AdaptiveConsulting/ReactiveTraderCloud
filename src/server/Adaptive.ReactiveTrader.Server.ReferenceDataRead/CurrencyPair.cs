namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPair
    {
        public string Symbol { get; }
        public int PipsPosition { get; }
        public int RatePrecision { get; }
        public decimal SampleRate { get; }
        public string Comment { get; }
        public bool IsEnabled { get; set; }

        public CurrencyPair(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment)
        {
            Symbol = symbol;
            PipsPosition = pipsPosition;
            RatePrecision = ratePrecision;
            SampleRate = sampleRate;
            Comment = comment;
        }
    }
}
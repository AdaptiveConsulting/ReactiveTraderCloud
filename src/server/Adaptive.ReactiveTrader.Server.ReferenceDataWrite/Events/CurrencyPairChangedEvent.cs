namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Events
{
    public class CurrencyPairChangedEvent
    {
        public string Symbol { get; }
        public int PipsPosition { get; }
        public int RatePrecision { get; }
        public int SampleRate { get; }
        public string Comment { get; }
        public string Name { get; } = "Currency Pair Changed";

        public CurrencyPairChangedEvent(string symbol, int pipsPosition, int ratePrecision, int sampleRate, string comment)
        {
            Symbol = symbol;
            PipsPosition = pipsPosition;
            RatePrecision = ratePrecision;
            SampleRate = sampleRate;
            Comment = comment;
        }
    }
}
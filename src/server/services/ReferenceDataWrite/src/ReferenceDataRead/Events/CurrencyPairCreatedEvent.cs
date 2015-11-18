namespace ReferenceDataRead.Events
{
    public class CurrencyPairCreatedEvent
    {
        public string Symbol { get; }
        public int PipsPosition { get; }
        public int RatePrecision { get; }
        public decimal SampleRate { get; }
        public string Comment { get; }
        public string Name { get; } = "Currency Pair Created";

        public CurrencyPairCreatedEvent(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment)
        {
            Symbol = symbol;
            PipsPosition = pipsPosition;
            RatePrecision = ratePrecision;
            SampleRate = sampleRate;
            Comment = comment;
        }
    }
}
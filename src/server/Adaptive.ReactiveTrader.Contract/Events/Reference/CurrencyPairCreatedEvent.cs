namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairCreatedEvent
    {
        public CurrencyPairCreatedEvent(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment)
        {
            Symbol = symbol;
            PipsPosition = pipsPosition;
            RatePrecision = ratePrecision;
            SampleRate = sampleRate;
            Comment = comment;
        }

        public static string Type { get; } = "Currency Pair Created";

        public string Symbol { get; }
        public int PipsPosition { get; }
        public int RatePrecision { get; }
        public decimal SampleRate { get; }
        public string Comment { get; }
    }
}
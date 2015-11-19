using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public abstract class CurrencyPairInfo
    {
        public CurrencyPairDto CurrencyPair { get; private set; }
        public decimal SampleRate { get; private set; }
        public bool Enabled { get; set; }
        public string Comment { get; set; }
        public bool Stale { get; set; }

        protected CurrencyPairInfo(CurrencyPairDto currencyPair, decimal sampleRate, bool enabled, string comment)
        {
            CurrencyPair = currencyPair;
            SampleRate = sampleRate;
            Enabled = enabled;
            Comment = comment;
        }

        public abstract PriceDto GenerateNextQuote(PriceDto lastPrice);
    }
}
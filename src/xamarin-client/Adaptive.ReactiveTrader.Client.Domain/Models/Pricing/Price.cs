using System;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Pricing
{
    internal class Price : IPrice, IPriceLatency
    {
        public Price(ExecutablePrice bid, ExecutablePrice ask, DateTime valueDate, ICurrencyPair currencyPair, long serverTimestamp)
        {
            _serverTimestamp = serverTimestamp;
            Bid = bid;
            Ask = ask;
            ValueDate = valueDate;
            CurrencyPair = currencyPair;

            bid.Parent = this;
            ask.Parent = this;

            Spread = (ask.Rate - bid.Rate)* (long)Math.Pow(10, currencyPair.PipsPosition);
        }

        public IExecutablePrice Bid { get; }
        public IExecutablePrice Ask { get; }

        public decimal Mid => (Ask.Rate + Bid.Rate)/2;

        public ICurrencyPair CurrencyPair { get; }
        public DateTime ValueDate { get; }
        public decimal Spread { get; }
        public bool IsStale => false;

        public override string ToString()
        {
            return string.Format("[{0}] Bid:{1} / Ask:{2}", CurrencyPair.Symbol, Bid.Rate, Ask.Rate);
        }

        #region IPriceLatency

        private readonly long _serverTimestamp;
        private long _receivedTimestamp;
        private long _renderedTimestamp;

        public double ServerToClientMs => GetElapsedMs(_serverTimestamp, _receivedTimestamp);

        public double UiProcessingTimeMs => GetElapsedMs(_receivedTimestamp, _renderedTimestamp);

        public void DisplayedOnUi()
        {
            _renderedTimestamp = Stopwatch.GetTimestamp();
        }

        public void ReceivedInGuiProcess()
        {
            _receivedTimestamp = Stopwatch.GetTimestamp();
        }

        public double TotalLatencyMs => UiProcessingTimeMs + ServerToClientMs;

        private static double GetElapsedMs(long start, long end)
        {
            return (double) (end - start)/Stopwatch.Frequency*1000;
        }

        #endregion

    }
}
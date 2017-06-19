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

        public IExecutablePrice Bid { get; private set; }
        public IExecutablePrice Ask { get; private set; }

        public decimal Mid
        {
            get { return (Ask.Rate + Bid.Rate)/2; }
        }

        public ICurrencyPair CurrencyPair { get; private set; }
        public DateTime ValueDate { get; private set; }
        public decimal Spread { get; private set; }
        public bool IsStale { get { return false; } }

        public override string ToString()
        {
            return string.Format("[{0}] Bid:{1} / Ask:{2}", CurrencyPair.Symbol, Bid.Rate, Ask.Rate);
        }

        #region IPriceLatency

        private readonly long _serverTimestamp;
        private long _receivedTimestamp;
        private long _renderedTimestamp;

        public double ServerToClientMs
        {
            get { return GetElapsedMs(_serverTimestamp, _receivedTimestamp); }
        }
        
        public double UiProcessingTimeMs
        {
            get { return GetElapsedMs(_receivedTimestamp, _renderedTimestamp); }
        }

        public void DisplayedOnUi()
        {
            _renderedTimestamp = Stopwatch.GetTimestamp();
        }

        public void ReceivedInGuiProcess()
        {
            _receivedTimestamp = Stopwatch.GetTimestamp();
        }

        public double TotalLatencyMs
        {
            get { return UiProcessingTimeMs + ServerToClientMs; }
        }

        private static double GetElapsedMs(long start, long end)
        {
            return (double) (end - start)/Stopwatch.Frequency*1000;
        }

        #endregion

    }
}
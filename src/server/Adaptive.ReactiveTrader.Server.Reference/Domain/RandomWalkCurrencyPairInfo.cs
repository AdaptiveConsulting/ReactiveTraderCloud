using System;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public sealed class RandomWalkCurrencyPairInfo : CurrencyPairInfo
    {
        private static readonly Random Random = new Random();
        private readonly int _halfSpread;

        public RandomWalkCurrencyPairInfo(CurrencyPairDto currencyPair, decimal sampleRate, bool enabled, string comment)
            : base(currencyPair, sampleRate, enabled, comment)
        {
            _halfSpread = Random.Next(2, 10);
        }

        public override PriceDto GenerateNextQuote(PriceDto previousPrice)
        {
            var pow = (decimal)Math.Pow(10, CurrencyPair.RatePrecision);
            var newMid = previousPrice.Mid + Random.Next(-5, 5) / pow;

            // check that the new mid does not drift too far from sampleRate (3%)
            if (Math.Abs(newMid - SampleRate) / SampleRate > .03m)
            {
                newMid = SampleRate;
            }
            
            return new PriceDto
            {
                Symbol = previousPrice.Symbol,
                SpotDate = DateTime.UtcNow.AddDays(2).Date.ToWeekday(),
                Mid = newMid,
                Ask = newMid + _halfSpread / pow,
                Bid = newMid - _halfSpread / pow,
                CreationTimestamp = Stopwatch.GetTimestamp()
            };
        }
    }
}
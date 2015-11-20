using System;
using System.Collections.Generic;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public sealed class RandomWalkPriceGenerator : IPriceGenerator
    {
        private readonly decimal _initial;
        private readonly int _precision;
        private static readonly Random Random = new Random();
        private readonly int _halfSpread;

        public RandomWalkPriceGenerator(string symbol, decimal initial, int precision)
        {
            _initial = initial;
            _precision = precision;
            Symbol = symbol;
            _halfSpread = Random.Next(2, 10);
        }

        public string Symbol { get; }

        public IEnumerable<SpotPriceDto> Sequence()
        {
            var previousMid = _initial;

            while (true)
            {
                var pow = (decimal) Math.Pow(10, _precision);
                var newMid = previousMid + Random.Next(-5, 5)/pow;

                // check that the new mid does not drift too far from sampleRate (3%)
                if (Math.Abs(newMid - _initial)/_initial > .03m)
                    newMid = _initial;

                yield return new SpotPriceDto
                {
                    symbol = Symbol,
                    valueDate = DateTime.UtcNow.AddDays(2).Date.ToWeekday(),
                    mid = newMid,
                    ask = newMid + _halfSpread/pow,
                    bid = newMid - _halfSpread/pow,
                    creationTimestamp = Stopwatch.GetTimestamp()
                };
            }
        }
    }
}
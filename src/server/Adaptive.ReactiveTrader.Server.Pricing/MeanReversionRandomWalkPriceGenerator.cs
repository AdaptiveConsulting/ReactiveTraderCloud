using System;
using System.Collections.Generic;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public sealed class MeanReversionRandomWalkPriceGenerator : IPriceGenerator
    {
        private static readonly Random Random = new Random();
        private readonly decimal _halfSpreadPercentage;
        private readonly decimal _initial;
        private readonly int _precision;
        private readonly decimal _reversion;
        private readonly decimal _vol;

        public MeanReversionRandomWalkPriceGenerator(string symbol, decimal initial, int precision, decimal reversionCoefficient = 0.005m, decimal volatility = 5m)
        {
            _initial = initial;
            _precision = precision;
            _reversion = reversionCoefficient;
            var power = (decimal) Math.Pow(10, precision);
            _vol = volatility*1m/power;
            Symbol = symbol; 
            _halfSpreadPercentage = Random.Next(2, 11)/power/_initial;
        }

        public string Symbol { get; }

        public IEnumerable<SpotPriceDto> Sequence()
        {
            var previousMid = _initial;

            while (true)
            {
                var random = (decimal) Random.NextNormal();
                previousMid += _reversion*(_initial - previousMid) + random*_vol;

                yield return new SpotPriceDto
                {
                    Symbol = Symbol,
                    ValueDate = DateTime.UtcNow.AddDays(2).Date,
                    Mid = Format(previousMid),
                    Ask = Format(previousMid*(1 + _halfSpreadPercentage)),
                    Bid = Format(previousMid*(1 - _halfSpreadPercentage)),
                    CreationTimestamp = Stopwatch.GetTimestamp()
                };
            }
        }

        private decimal Format(decimal price)
        {
            var power = (decimal) Math.Pow(10, _precision);
            var mid = (int) (price*power);
            return mid/power;
        }
    }
}
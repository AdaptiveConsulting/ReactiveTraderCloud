using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public sealed class MeanReversionRandomWalkPriceGenerator : IPriceGenerator
    {
        private static readonly ThreadLocal<Random> Random = new ThreadLocal<Random>(() => new Random());
        private readonly decimal _halfSpreadPercentage;
        private readonly decimal _initial;
        private readonly int _precision;
        private readonly decimal _reversion;
        private readonly decimal _vol;

        public MeanReversionRandomWalkPriceGenerator(string symbol, decimal initial, int precision, decimal reversionCoefficient = 0.001m, decimal volatility = 5m)
        {
            _initial = initial;
            _precision = precision;
            _reversion = reversionCoefficient;
            var power = (decimal) Math.Pow(10, precision);
            _vol = volatility*1m/power;
            Symbol = symbol; 
            _halfSpreadPercentage = Random.Value.Next(2, 16)/power/_initial;
        }

        public string Symbol { get; }

        public IEnumerable<SpotPriceDto> Sequence()
        {
            var previousMid = _initial;

            while (true)
            {
                var random = (decimal) Random.Value.NextNormal();
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
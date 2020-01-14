using System;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public sealed class RandomWalkPriceGenerator : BaseWalkPriceGenerator, IPriceGenerator
  {
    private readonly int _halfSpread;

    public RandomWalkPriceGenerator(CurrencyPair currencyPair, decimal initial, int precision)
      : base(currencyPair, initial, precision)
    {
      _halfSpread = Random.Value.Next(2, 10);
    }

    public override void UpdateWalkPrice()
    {
      var pow = (decimal)Math.Pow(10, _precision);
      var newMid = _previousMid + Random.Value.Next(-5, 6) / pow;

      // check that the new Mid does not drift too far from sampleRate (3%)
      if (Math.Abs(newMid - _initial) / _initial > .03m)
        newMid = _initial;

      _previousMid = newMid;

      _priceChanges.OnNext(
        new SpotPriceDto
        {
          Symbol = CurrencyPair.Symbol,
          ValueDate = DateTime.UtcNow.AddWeekDays(2),
          Mid = newMid,
          Ask = newMid + _halfSpread / pow,
          Bid = newMid - _halfSpread / pow,
          CreationTimestamp = Stopwatch.GetTimestamp()
        });
    }
  }
}


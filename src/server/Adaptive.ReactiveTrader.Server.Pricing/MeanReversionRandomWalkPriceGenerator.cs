using System;
using System.Diagnostics;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public sealed class MeanReversionRandomWalkPriceGenerator : BaseWalkPriceGenerator, IPriceGenerator
  {
    private readonly decimal _halfSpreadPercentage;
    private readonly decimal _reversion;
    private readonly decimal _vol;

    public MeanReversionRandomWalkPriceGenerator(CurrencyPair currencyPair, decimal initial, int precision, decimal reversionCoefficient = 0.001m, decimal volatility = 5m)
      : base(currencyPair, initial, precision)
    {
      _reversion = reversionCoefficient;
      var power = (decimal)Math.Pow(10, precision);
      _vol = volatility * 1m / power;
      _halfSpreadPercentage = Random.Value.Next(2, 16) / power / _initial;
    }

    public override void UpdateWalkPrice()
    {
      var random = (decimal)Random.Value.NextNormal();
      lock (_lock)
      {
        _previousMid += _reversion * (_initial - _previousMid) + random * _vol;
      }

      _priceChanges.OnNext(
        new SpotPriceDto
        {
          Symbol = CurrencyPair.Symbol,
          ValueDate = DateTime.UtcNow.AddDays(2).Date,
          Mid = Format(_previousMid),
          Ask = Format(_previousMid * (1 + _halfSpreadPercentage)),
          Bid = Format(_previousMid * (1 - _halfSpreadPercentage)),
          CreationTimestamp = Stopwatch.GetTimestamp()
        });
    }


    private decimal Format(decimal price)
    {
      var power = (decimal)Math.Pow(10, _precision);
      var mid = (int)(price * power);
      return mid / power;
    }
  }
}

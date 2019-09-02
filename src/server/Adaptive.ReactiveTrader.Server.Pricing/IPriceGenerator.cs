using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public interface IPriceGenerator
  {
    string Symbol { get; }
    DateTime EffectiveDate { get; }
    string SourceName { get; }
    decimal SampleRate { get; }
    void UpdateInitialValue(decimal newValue, DateTime effectiveDate, string sourceName);
    void UpdateWalkPrice();
    IObservable<SpotPriceDto> PriceChanges { get; }
  }
}

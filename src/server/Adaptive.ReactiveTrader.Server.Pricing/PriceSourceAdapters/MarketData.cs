using System;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public class MarketData
  {
    public MarketData(CurrencyPair currencyPair, decimal sampleRate, DateTime date, string source)
    {
      CurrencyPair = currencyPair;
      SampleRate = sampleRate;
      Date = date;
      Source = source;
    }
    public CurrencyPair CurrencyPair { get; }
    public decimal SampleRate { get; }
    public DateTime Date { get; }
    public string Source { get; }

    public override string ToString() => $"{CurrencyPair.Symbol} | {SampleRate} | {Date} | {Source}";
  }
}

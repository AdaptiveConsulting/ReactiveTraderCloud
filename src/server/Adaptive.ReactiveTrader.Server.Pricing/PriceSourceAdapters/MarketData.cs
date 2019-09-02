using System;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public class MarketData
  {
    public MarketData(string symbol, decimal sampleRate, DateTime date, string source)
    {
      Symbol = symbol;
      SampleRate = sampleRate;
      Date = date;
      Source = source;
    }
    public string Symbol { get; }
    public decimal SampleRate { get; }
    public DateTime Date { get; }
    public string Source { get; }

    public override string ToString() => $"{Symbol} | {SampleRate} | {Date} | {Source}";
  }
}

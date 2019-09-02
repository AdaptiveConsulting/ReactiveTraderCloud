using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public sealed class PriceSource : IDisposable
  {
    public const string HardCodedSourceName = "hard-coded";

    private static readonly Random Random = new Random();
    private readonly Dictionary<string, IPriceGenerator> _priceGenerators;
    private readonly CompositeDisposable _disposable = new CompositeDisposable();
    private readonly IConnectableObservable<long> _timer;
    private readonly List<IMarketDataAdapter> _marketAdapters = new List<IMarketDataAdapter>();

    private DateTime _lastMarketUpdate = new DateTime(2019, 1, 1);


    public PriceSource()
    {
      //register the required data source adapters
      _marketAdapters.Add(new FinancialModelingPrepAdapter());
      _marketAdapters.Add(new YahooFinanceCurrencyAdapter());

      _priceGenerators = (new[] {
            CreatePriceGenerator("EURUSD", 1.09443m, 5),
            CreatePriceGenerator("USDJPY", 121.656m, 3),
            CreatePriceGenerator("GBPUSD", 1.51746m, 5),
            CreatePriceGenerator("GBPJPY", 184.608m, 3),
            CreatePriceGenerator("EURGBP", 0.72123m, 5),
            CreatePriceGenerator("USDCHF", 0.98962m, 5),
            CreatePriceGenerator("EURJPY", 133.144m, 3),
            CreatePriceGenerator("EURCHF", 1.08318m, 5),
            CreatePriceGenerator("AUDUSD", 0.72881m, 5),
            CreatePriceGenerator("NZDUSD", 0.6729m, 5),
            CreatePriceGenerator("EURCAD", 1.48363m, 5),
            CreatePriceGenerator("EURAUD", 1.50157m, 5),
            CreatePriceGenerator("AUDCAD", 0.98805m, 5),
            CreatePriceGenerator("GBPCHF", 1.50193m, 5),
            CreatePriceGenerator("CHFJPY", 122.914m, 3),
            CreatePriceGenerator("AUDJPY", 88.666m, 3),
            CreatePriceGenerator("AUDNZD", 1.08334m, 5),
            CreatePriceGenerator("CADJPY", 89.7685m, 3),
            CreatePriceGenerator("CHFUSD", 1.01027m, 5),
            CreatePriceGenerator("EURNOK", 9.44156m, 4),
            CreatePriceGenerator("EURSEK", 9.26876m, 4)
        }).ToDictionary(x => x.Symbol);

      var keys = _priceGenerators.Keys.ToArray();

      _timer = Observable.Interval(TimeSpan.FromMilliseconds(50)).Publish();
      _disposable.Add(_timer.Subscribe(observer =>
      {
        if ((DateTime.Now - _lastMarketUpdate).TotalHours > 24)
        {
          //Just refresh the currency pairs back to real market values once every 24 hours.
          //Note some of the prices sources (e.g. https://fixer.io) are only free if there are less than a restricted number of API calls per month.
          RefreshMarketRates(DateTime.UtcNow);
        }
        _priceGenerators[keys[Random.Next(_priceGenerators.Count)]].UpdateWalkPrice();
      }));

      _timer.Connect();
    }

    public void Dispose()
    {
      _disposable.Dispose();
    }

    private static IPriceGenerator CreatePriceGenerator(string symbol, decimal initial, int precision)
    {
      return new MeanReversionRandomWalkPriceGenerator(symbol, initial, precision);
    }

    private void RefreshMarketRates(DateTime refreshDateTime)
    {
      foreach (var adapter in _marketAdapters)
      {
        var marketData = new List<MarketData>(adapter.GetMarketData().Result);
        foreach (var item in marketData)
        {
          if (_priceGenerators.TryGetValue(item.Symbol, out IPriceGenerator priceGenerator) && (refreshDateTime - priceGenerator.EffectiveDate).TotalHours > 12)
          {
            priceGenerator.UpdateInitialValue(item.SampleRate, item.Date, item.Source);
          }
        }
      }
      ComputeMissingReciprocals();
      _lastMarketUpdate = refreshDateTime;
    }

    /// <summary>
    /// Currency pairs are typically listed only as Major/Minor CCY codes. This method computes the reciprocal rate for missing Minor/Majors
    /// </summary>
    private void ComputeMissingReciprocals()
    {
      var missing = _priceGenerators.Values.Where(x => x.SourceName == HardCodedSourceName || x.SourceName.Contains("1/")).ToArray();
      foreach (var item in missing)
      {
        var reciprocalSymbol = item.Symbol.Substring(3, 3) + item.Symbol.Substring(0, 3);
        if (_priceGenerators.TryGetValue(reciprocalSymbol, out IPriceGenerator other) && other.SourceName != HardCodedSourceName)
        {
          item.UpdateInitialValue(1m / other.SampleRate, other.EffectiveDate, $"1/ {other.SourceName}");
        }
      }
    }


    public IObservable<SpotPriceDto> GetPriceStream(string symbol)
    {
      return _priceGenerators[symbol].PriceChanges;
    }

    public IObservable<SpotPriceDto> GetAllPricesStream()
    {
      return _priceGenerators.Values.Select(x => x.PriceChanges).Merge();
    }
  }
}

using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
  public sealed class PriceSource : IDisposable
  {
    public const string HardCodedSourceName = "hard-coded";
    public const int HourlyMarketRateUpdateFrequency = 1;

    private static readonly Random Random = new Random();
    private static readonly Dictionary<string, IPriceGenerator> _priceGenerators;
    private readonly CompositeDisposable _disposables = new CompositeDisposable();
    private readonly Timer _priceWalkTimer;
    private readonly Timer _marketRatesTimer;
    private readonly List<IMarketDataAdapter> _marketAdapters = new List<IMarketDataAdapter>();

    private DateTime _lastMarketUpdate = GetThisHour().AddHours(-2);

    static PriceSource()
    {
      _priceGenerators = (new[] {
            CreatePriceGenerator("EUR","USD", 1.09443m, 5),
            CreatePriceGenerator("USD","JPY", 121.656m, 3),
            CreatePriceGenerator("GBP","USD", 1.51746m, 5),
            CreatePriceGenerator("GBP","JPY", 184.608m, 3),
            CreatePriceGenerator("EUR","GBP", 0.72123m, 5),
            CreatePriceGenerator("USD","CHF", 0.98962m, 5),
            CreatePriceGenerator("EUR","JPY", 133.144m, 3),
            CreatePriceGenerator("EUR","CHF", 1.08318m, 5),
            CreatePriceGenerator("AUD","USD", 0.72881m, 5),
            CreatePriceGenerator("NZD","USD", 0.6729m, 5),
            CreatePriceGenerator("EUR","CAD", 1.48363m, 5),
            CreatePriceGenerator("EUR","AUD", 1.50157m, 5),
            CreatePriceGenerator("AUD","CAD", 0.98805m, 5),
            CreatePriceGenerator("GBP","CHF", 1.50193m, 5),
            CreatePriceGenerator("CHF","JPY", 122.914m, 3),
            CreatePriceGenerator("AUD","JPY", 88.666m, 3),
            CreatePriceGenerator("AUD","NZD", 1.08334m, 5),
            CreatePriceGenerator("CAD","JPY", 89.7685m, 3),
            CreatePriceGenerator("CHF","USD", 1.01027m, 5),
            CreatePriceGenerator("EUR","NOK", 9.44156m, 4),
            CreatePriceGenerator("EUR","SEK", 9.26876m, 4)
        }).ToDictionary(x => x.CurrencyPair.Symbol);
    }

    public PriceSource()
    {
      //register the required data source adapters in descending priority order
      _marketAdapters.Add(new EuropeanCentralBankAdapter());
      _marketAdapters.Add(new FinancialModelingPrepAdapter());
      _marketAdapters.Add(new YahooFinanceCurrencyAdapter());

      var keys = _priceGenerators.Keys.ToArray();
      _priceWalkTimer = new Timer();
      _priceWalkTimer.Interval = 50;
      _priceWalkTimer.Elapsed += delegate (object sender, ElapsedEventArgs e) { _priceGenerators[keys[Random.Next(_priceGenerators.Count)]].UpdateWalkPrice(); };
      _disposables.Add(_priceWalkTimer);

      _marketRatesTimer = new Timer();
      _marketRatesTimer.Interval = 1000;
      _marketRatesTimer.Elapsed += async delegate (object sender, ElapsedEventArgs e)
      {
        var now = GetThisHour();
        if ((now - _lastMarketUpdate).TotalHours > HourlyMarketRateUpdateFrequency)
        {
          try
          {
            _marketRatesTimer.Enabled = false;
            await RefreshMarketRates(now);
            Log.Information("Market Rates update succeeded");
          }
          catch (Exception ex)
          {
            Log.Error(ex, "Market Rates update failed with exception");
          }
          finally
          {
            _marketRatesTimer.Enabled = true;
          }
        }
      };
      _disposables.Add(_marketRatesTimer);

      _priceWalkTimer.Enabled = true;
      _marketRatesTimer.Enabled = true;
    }

    public void Dispose()
    {
      _disposables.Dispose();
    }

    private static IPriceGenerator CreatePriceGenerator(string baseCcy, string quoteCcy, decimal initial, int precision)
    {
      return new MeanReversionRandomWalkPriceGenerator(new CurrencyPair(baseCcy, quoteCcy), initial, precision);
    }

    private async Task RefreshMarketRates(DateTime refreshDateTime)
    {
      foreach (var adapter in _marketAdapters)
      {
        try
        {
          var marketData = new List<MarketData>(await adapter.GetMarketData());
          foreach (var item in marketData)
          {
            //Any item older than 10 minutes is considered available to update, this way if the preceeding adapters did not update the rate then perhaps the next adapter will
            if (
              _priceGenerators.TryGetValue(item.CurrencyPair.Symbol, out IPriceGenerator priceGenerator) &&
              (DateTime.UtcNow - priceGenerator.EffectiveDate).TotalMinutes > 10)
            {
              priceGenerator.UpdateInitialValue(item.SampleRate, item.Date, item.Source);
            }
          }
        }
        catch(Exception ex)
        {
          Log.Error(ex, $"Adapter for {adapter.RequestUriString} threw an unhandled exception");
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
        if (_priceGenerators.TryGetValue(item.CurrencyPair.ReciprocalSymbol, out IPriceGenerator other) && other.SourceName != HardCodedSourceName)
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

    public static IEnumerable<string> GetAllBaseCurrencies() => _priceGenerators.Values.Select(x => x.CurrencyPair.BaseCcy).Distinct();
    public static IEnumerable<string> GetAllQuoteCurrencies(string forBaseCcy) => _priceGenerators.Values
      .Where(x=>x.CurrencyPair.BaseCcy == forBaseCcy)
      .Select(x => x.CurrencyPair.QuoteCcy).Distinct();

    private static DateTime GetThisHour() => DateTime.UtcNow.Date.AddHours(DateTime.UtcNow.Hour);

  }
}

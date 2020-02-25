using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public class EuropeanCentralBankAdapter : IMarketDataAdapter
  {
    private const string requestUriString = "https://api.exchangeratesapi.io/latest";
    private const string sourceName = "European Central Bank";

    private readonly BaseJsonApiAdapter _adapter;

    public EuropeanCentralBankAdapter()
    {
      _adapter = new BaseJsonApiAdapter(requestUriString);
    }

    public string RequestUriString => _adapter.RequestUriString;

    /// <summary>
    /// The API returns json data in this format for each base currency:
    /// {
    ///   "base": "EUR",
    ///   "date": "2019-09-03",
    ///   "rates": {
    ///       "AUD": 1.566015,
    ///       "CAD": 1.560132,
    ///       "CHF": 1.154727,
    ///       "CNY": 7.827874,
    ///       "GBP": 0.882047,
    ///       "JPY": 132.360679,
    ///       "USD": 1.23396,
    ///      [...]
    ///   }
    /// }
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<MarketData>> GetMarketData()
    {
      var result = new Dictionary<string, MarketData>();
      try
      {
        foreach (var row in await GetJson())
        {
          var baseCcy = row.Value<string>("base");
          var date = DateTime.SpecifyKind(row.Value<DateTime>("date"), DateTimeKind.Utc);
          foreach (JProperty rate in row["rates"])
          {
            var currencyPair = new CurrencyPair(baseCcy, rate.Name);
            if (!result.ContainsKey(currencyPair.Symbol))
            {
              var sampleRate = rate.Value.Value<decimal>();
              result.Add(currencyPair.Symbol, new MarketData(currencyPair, sampleRate, date, sourceName));
            }
          }
        }
        Log.Information($"Successfully received {result.Count} currency pairs from {_adapter.RequestUriString}");
      }
      catch (Exception ex)
      {
        Log.Error(ex, $"API call to {_adapter.RequestUriString} failed with exception");
      }
      return result.Values;
    }

    private async Task<JArray> GetJson()
    {
      var results = new List<JObject>();
      foreach (var baseCcy in PriceSource.GetAllBaseCurrencies())
      {
        //We do multiple requests, one for each base ccy
        var symbols = string.Join(',', PriceSource.GetAllQuoteCurrencies(baseCcy));
        var queryParameters = $"?base={baseCcy}&symbols={symbols}";
        var json = await _adapter.GetRequestJson(queryParameters);
        results.Add(json);
      }
      return new JArray(results);
    }

  }
}

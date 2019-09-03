using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Scrapes currency pair data from a website called data.fixer.io and returns the currency pairs
  /// Note https://fixer.io is only free if there are less than a restricted number of API calls per month.
  /// </summary>
  public class FixerAdapter : FixerBaseAdapter, IMarketDataAdapter
  {
    private const string requestUriString = "https://data.fixer.io/api/latest";
    private const string sourceName = "Fixer";
    private const string API_Key = "APIKEY";

    public FixerAdapter() : base(requestUriString)
    {
    }

    /// <summary>
    /// Not currently used because we do not have an API key yet, and the European Central Bank is free!
    /// </summary>
    /// <returns></returns>
    public override async Task<IEnumerable<MarketData>> GetMarketData()
    {
      /*
       The data is returned in this format for each base currency:
        {
          "success": true,
          "timestamp": 1519296206,
          "base": "EUR",
          "date": "2019-09-03",
          "rates": {
              "AUD": 1.566015,
              "CAD": 1.560132,
              "CHF": 1.154727,
              "CNY": 7.827874,
              "GBP": 0.882047,
              "JPY": 132.360679,
              "USD": 1.23396,
          [...]
          }
        }      
      */
      var result = new Dictionary<string, MarketData>();
      try
      {
        foreach (var row in await GetJson())
        {
          var baseCcy = row.Value<string>("base");
          var date = UnixTimeStampToDateTime(row.Value<double>("timestamp"));
          foreach (JProperty rate in row["rates"])
          {
            var symbol = baseCcy + rate.Name;
            if (!result.ContainsKey(symbol))
            {
              var sampleRate = rate.Value<decimal>();
              result.Add(symbol, new MarketData(symbol, sampleRate, date, sourceName));
            }
          }
        }
        Log.Information($"Successfully received {result.Count} currency pairs from {RequestUriString}");
      }
      catch (Exception ex)
      {
        Log.Error(ex, $"API call to {RequestUriString} failed with exception");
      }
      return result.Values;
    }

    private async Task<JArray> GetJson()
    {
      var results = new List<JObject>();
      foreach (var baseCcy in _currencies)
      {
        //We do multiple requests, one for each base ccy
        var symbols = string.Join(',', _currencies.Where(x => x != baseCcy));
        var queryParameters = $"?access_key={API_Key}&base={baseCcy}&symbols={symbols}";
        var json = await GetRequestJson(queryParameters);
        results.Add(json);
      }
      return new JArray(results);
    }


  }
}

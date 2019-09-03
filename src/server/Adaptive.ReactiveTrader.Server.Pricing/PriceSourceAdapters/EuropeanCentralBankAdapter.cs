using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public class EuropeanCentralBankAdapter : FixerBaseAdapter, IMarketDataAdapter
  {
    private const string requestUriString = "https://api.exchangeratesapi.io/latest";

    private const string sourceName = "European Central Bank";

    public EuropeanCentralBankAdapter() : base(requestUriString)
    {
    }

    public override async Task<IEnumerable<MarketData>> GetMarketData()
    {
      /*
       The data is returned in this format for each base currency:
        {
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
          var date = DateTime.SpecifyKind( row.Value<DateTime>("date"), DateTimeKind.Utc);
          foreach (JProperty rate in row["rates"])
          {
            var symbol = baseCcy + rate.Name;
            if (!result.ContainsKey(symbol))
            {
              var sampleRate = rate.Value.Value<decimal>();
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
        var queryParameters = $"?base={baseCcy}&symbols={symbols}";
        var json = await GetRequestJson(queryParameters);
        results.Add(json);
      }
      return new JArray(results);
    }

  }
}

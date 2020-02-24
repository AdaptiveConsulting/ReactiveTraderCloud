using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Scrapes currency pair data from yahoo.com and returns the currency pairs. Note this is an example of an html scraper so this adapter is used only when other API sources have failed.
  /// </summary>
  public class YahooFinanceCurrencyAdapter : IMarketDataAdapter
  {
    private const string requestUriString = "https://uk.finance.yahoo.com/currencies";
    private const string sourceName = "Yahoo";

    private readonly BaseHtmlDocumentAdapter _adapter;
    private readonly string[] _findRowHeaders = { "Symbol", "Name", "Last price" };

    public YahooFinanceCurrencyAdapter()
    {
      _adapter = new BaseHtmlDocumentAdapter(requestUriString);
    }
    public string RequestUriString => _adapter.RequestUriString;

    /// <summary>
    /// The data is returned in this format for each currency pair:
    /// {
    ///   "Symbol": "GBPUSD=X",
    ///   "Name": "GBP/USD",
    ///   "Last price": "1.2186",
    ///   "Change": "-0.0031",
    ///   "% change": "-0.2535%",
    ///   "52-week range": "",
    ///   "Day chart": ""
    /// }
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<MarketData>> GetMarketData()
    {
      var result = new List<MarketData>();
      try
      {
        foreach (var row in await GetJson())
        {
          var currencyPair = new CurrencyPair(row.Value<string>("Name").Replace("/", ""));
          var sampleRate = row.Value<decimal>("Last price");
          var date = DateTime.UtcNow;
          result.Add(new MarketData(currencyPair, sampleRate, date, sourceName));
        }
        Log.Information($"Successfully received {result.Count} currency pairs from {RequestUriString}");
      }
      catch (Exception ex)
      {
        Log.Error(ex, $"API call to {RequestUriString} failed with exception");
      }
      return result;
    }

    private async Task<JArray> GetJson()
    {
      var document = await _adapter.GetRequestHtmlDocument("?guccounter=1");
      var table = _adapter.FindTableUsingRowHeaders(document.DocumentNode, _findRowHeaders);
      return _adapter.GetHtmlTable(table);
    }
  }
}

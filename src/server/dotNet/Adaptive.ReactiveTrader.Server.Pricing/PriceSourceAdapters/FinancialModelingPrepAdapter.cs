using Newtonsoft.Json.Linq;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Scrapes currency pair data from a website called financialmodelingprep.com and returns the currency pairs
  /// </summary>
  public class FinancialModelingPrepAdapter : IMarketDataAdapter
  {
    private const string windowsTimeZoneId = "US Eastern Standard Time";
    private const string linuxTimeZoneId = "America/New_York";
    private const string requestUriString = "https://financialmodelingprep.com/api/v3/forex";
    private const string jsonDataPropertyName = "forexList";
    private const string sourceName = "FinancialModelingPrep";

    private readonly BaseJsonApiAdapter _adapter;

    public FinancialModelingPrepAdapter()
    {
      _adapter = new BaseJsonApiAdapter(requestUriString);

      //This API seems to be based on the US east coast and publishes what looks like local times (not even UTC)
      try
      {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById(windowsTimeZoneId);
      }
      catch (TimeZoneNotFoundException)
      {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById(linuxTimeZoneId);
      }
    }

    public string RequestUriString => _adapter.RequestUriString;
    public TimeZoneInfo TimeZone { get; }

    /// <summary>
    /// The API returns json data in this format for each currency pair:
    /// {
    ///    "ticker": "EUR/USD",
    ///    "bid": "1.10783",
    ///    "ask": "1.10787",
    ///    "open": "1.10797",
    ///    "low": "1.10759",
    ///    "high": "1.10876",
    ///    "changes": -0.010830618157522133,
    ///    "date": "2019-08-29 03:45:49"
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
          var currencyPair = new CurrencyPair(row.Value<string>("ticker").Replace("/", ""));
          var sampleRate = (row.Value<decimal>("bid") + row.Value<decimal>("ask")) / 2m;
          var date = TimeZoneInfo.ConvertTimeToUtc(row.Value<DateTime>("date"), TimeZone);
          result.Add(new MarketData(currencyPair, sampleRate, date, sourceName));
        }
        Log.Information($"Successfully received {result.Count} currency pairs from {RequestUriString}");
      }
      catch(Exception ex)
      {
        Log.Error(ex, $"API call to {RequestUriString} failed with exception");
      }
      return result;
    }

    private async Task<JArray> GetJson()
    {
      var json = await _adapter.GetRequestJson();
      return json.Value<JArray>(jsonDataPropertyName);
    }
  }
}

using HtmlAgilityPack;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  public abstract class AdapterBase
  {
    public AdapterBase(string requestUriString)
    {
      RequestUriString = requestUriString;
    }

    public abstract Task<IEnumerable<MarketData>> GetMarketData();

    public string RequestUriString { get; }

    /// <summary>
    /// Called when the remote site returns a response containing json
    /// </summary>
    /// <returns>The http response content as a JObject</returns>
    protected async Task<JObject> GetRequestJson(string queryParameters = "")
    {
      using (var stream = await GetRequestStream(RequestUriString + queryParameters))
      {
        using (var sr = new StreamReader(stream))
        {
          using (var jr = new JsonTextReader(sr))
          {
            var serializer = new JsonSerializer();
            return serializer.Deserialize<JObject>(jr);
          }
        }
      }
    }

    /// <summary>
    /// Creates an HttpClient and executes a get request
    /// </summary>
    /// <returns>The http response content as a Stream</returns>
    protected async Task<Stream> GetRequestStream(string requestUriString)
    {
      using (var hc = new HttpClient())
      {
        var result = await hc.GetAsync(requestUriString);
        return await result.Content.ReadAsStreamAsync();
      }
    }

    /// <summary>
    /// Called when the remote site returns a response containing html
    /// </summary>
    /// <returns>The http response content as an HtmlDocument that can be queried with XPath</returns>
    protected async Task<HtmlDocument> GetRequestHtmlDocument(string queryParameters = "")
    {
      using (var stream = await GetRequestStream(RequestUriString + queryParameters))
      {
        var document = new HtmlDocument();
        document.Load(stream);
        return document;
      }
    }

    /// <summary>
    /// Searches for an html table by comparing its row headers with the find values
    /// </summary>
    /// <param name="documentNode"></param>
    /// <param name="findRowHeaders"></param>
    /// <returns>The HtmlNode for the table, or null if none was found</returns>
    protected HtmlNode FindTableUsingRowHeaders(HtmlNode documentNode, string[] findRowHeaders)
    {
      var headerText = new HashSet<string>(findRowHeaders);
      var tables = documentNode.SelectNodes("//table");
      foreach (var table in tables)
      {
        var count = table.SelectNodes("//th").Count(x => headerText.Contains(x.InnerText));
        if (count == headerText.Count) return table;
      }
      return null;
    }

    /// <summary>
    /// Converts an html table into a JArray where each element is one html table row
    /// </summary>
    /// <param name="table">the html table located</param>
    /// <returns>JArray</returns>
    protected JArray GetHtmlTable(HtmlNode table)
    {
      var jsonRows = new List<JObject>();
      var headers = table.SelectNodes("//th").Select(x => x.InnerText).ToArray();
      var tableDataRows = table.SelectSingleNode("//tbody").ChildNodes.ToArray();
      foreach (var tr in tableDataRows)
      {
        var data = tr.ChildNodes.Select(x => x.InnerText).ToArray();
        var properties = new List<JProperty>();
        for (var columnIndex = 0; columnIndex < headers.Length; columnIndex++)
        {
          properties.Add(new JProperty(headers[columnIndex], data[columnIndex]));
        }
        jsonRows.Add(new JObject(properties.ToArray()));
      }
      return new JArray(jsonRows.ToArray());
    }

    protected static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
    {
      // Unix timestamp is seconds past epoch
      var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
      dtDateTime = dtDateTime.AddSeconds(unixTimeStamp);
      return dtDateTime;
    }

  }
}

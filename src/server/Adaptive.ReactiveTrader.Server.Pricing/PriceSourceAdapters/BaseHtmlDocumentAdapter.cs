using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Requests an html page from a remote source and implements methods to find an html table and parse it into json
  /// </summary>
  public class BaseHtmlDocumentAdapter
  {
    public BaseHtmlDocumentAdapter(string requestUriString)
    {
      RequestUriString = requestUriString;
    }

    public string RequestUriString { get; }

    /// <summary>
    /// Creates an HttpClient and executes a get request
    /// </summary>
    /// <returns>The http response content as a Stream</returns>
    public async Task<Stream> GetRequestStream(string requestUriString)
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
    public async Task<HtmlDocument> GetRequestHtmlDocument(string queryParameters = "")
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
    public HtmlNode FindTableUsingRowHeaders(HtmlNode documentNode, string[] findRowHeaders)
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
    public JArray GetHtmlTable(HtmlNode table)
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

  }
}

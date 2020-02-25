using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.Pricing.PriceSourceAdapters
{
  /// <summary>
  /// Calls a remote API and parses the received json into a newtonsoft JObject
  /// </summary>
  public class BaseJsonApiAdapter
  {
    public BaseJsonApiAdapter(string requestUriString)
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
    /// Called when the remote site returns a response containing json
    /// </summary>
    /// <returns>The http response content as a JObject</returns>
    public async Task<JObject> GetRequestJson(string queryParameters = "")
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

  }
}

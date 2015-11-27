using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Adaptive.ReactiveTrader.Contract
{
    public class CurrencyPairUpdateDto
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public UpdateTypeDto UpdateType { get; set; }
        public CurrencyPairDto CurrencyPair { get; set; }

        public override string ToString()
        {
            return string.Format("UpdateType: {0}, CurrencyPair: {1}", UpdateType, CurrencyPair);
        }
    }
}
using System;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Shared.DTO.Pricing
{
    public class PriceDto
    {
        [JsonProperty(PropertyName = "s")]
        public string Symbol { get; set; }

        [JsonProperty(PropertyName = "b")]
        public decimal Bid { get; set; }

        [JsonProperty(PropertyName = "a")]
        public decimal Ask { get; set; }

        [JsonProperty(PropertyName = "d")]
        public long ValueDate { get; set; }
        
        [JsonProperty(PropertyName = "t")]
        public long CreationTimestamp { get; set; }

        /// <summary>
        /// only used for price generation
        /// </summary>
        [JsonIgnore]
        public decimal Mid { get; set; }

        private static readonly DateTime EpochDate = new DateTime(1970, 1, 1);

        [JsonIgnore]
        public DateTime SpotDate
        {
            get { return EpochDate.AddMilliseconds(ValueDate); }
            set { ValueDate = (long)(value - EpochDate).TotalMilliseconds; }
        }
    }
}
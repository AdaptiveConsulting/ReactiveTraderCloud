using System;

namespace Adaptive.ReactiveTrader.Shared.DTO.Pricing
{
    public class PriceDto
    {
        public string Symbol { get; set; }

        public decimal Bid { get; set; }

        public decimal Ask { get; set; }

        public DateTime ValueDate { get; set; }
        
        public long CreationTimestamp { get; set; }

        public DateTime SpotDate => ValueDate;
    }
}
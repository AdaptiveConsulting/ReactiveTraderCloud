using System;

namespace Adaptive.ReactiveTrader.Contract
{
    public class PriceDto
    {
        public string Symbol { get; set; }
        public DateTime SpotDate { get; set; }
        public decimal Mid { get; set; }
        public decimal Ask { get; set; }
        public decimal Bid { get; set; }
        public long CreationTimestamp { get; set; }
    }
}
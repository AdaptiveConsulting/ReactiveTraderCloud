using System;

namespace Adaptive.ReactiveTrader.Contract
{
    public class SpotPriceDto
    {
        public string Symbol { get; set; }
        public decimal Bid { get; set; }
        public decimal Ask { get; set; }
        public decimal Mid { get; set; }
        public DateTime ValueDate { get; set; }
        public long CreationTimestamp { get; set; }
    }
}
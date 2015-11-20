using System;

namespace Adaptive.ReactiveTrader.Contract
{
    public class SpotPriceDto
    {
        public string symbol { get; set; }
        public decimal bid { get; set; }
        public decimal ask { get; set; }
        public decimal mid { get; set; }
        public DateTime valueDate { get; set; }
        public long creationTimestamp { get; set; }
    }
}
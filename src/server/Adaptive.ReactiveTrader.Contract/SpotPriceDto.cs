using System;
using ProtoBuf;

namespace Adaptive.ReactiveTrader.Contract
{
    [ProtoContract]
    public class SpotPriceDto
    {
        [ProtoMember(1)]
        public string Symbol { get; set; }

        [ProtoMember(2)]
        public decimal Bid { get; set; }

        [ProtoMember(3)]
        public decimal Ask { get; set; }

        [ProtoMember(4)]
        public decimal Mid { get; set; }

        [ProtoMember(5)]
        public DateTime ValueDate { get; set; }

        [ProtoMember(6)]
        public long CreationTimestamp { get; set; }
    }
}
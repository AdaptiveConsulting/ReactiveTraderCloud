using System;
using ProtoBuf;

namespace Adaptive.ReactiveTrader.Contract
{
    [ProtoContract]
    public class SpotPriceDto
    {
        [ProtoMember(1)]
        public string symbol { get; set; }

        [ProtoMember(2)]
        public decimal bid { get; set; }

        [ProtoMember(3)]
        public decimal ask { get; set; }

        [ProtoMember(4)]
        public decimal mid { get; set; }

        [ProtoMember(5)]
        public DateTime valueDate { get; set; }

        [ProtoMember(6)]
        public long creationTimestamp { get; set; }
    }
}
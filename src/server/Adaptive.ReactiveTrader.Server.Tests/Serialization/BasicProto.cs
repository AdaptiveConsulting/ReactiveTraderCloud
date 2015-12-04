using System;
using System.IO;
using System.Runtime.Serialization;
using System.Text;
using MsgPack.Serialization;
using Newtonsoft.Json;
using ProtoBuf;
using Xunit;
using SerializationContext = MsgPack.Serialization.SerializationContext;

namespace Adaptive.ReactiveTrader.Server.Tests.Serialization
{
    [ProtoContract, DataContract]
    public class SpotPriceDto
    {
        [ProtoMember(1)]
        [JsonProperty("s")]
        [DataMember(Name = "s")]
        public string symbol { get; set; }

        [ProtoMember(2)]
        [JsonProperty("b")]
        [DataMember(Name = "b")]
        public double bid { get; set; }

        [ProtoMember(3)]
        [JsonProperty("a")]
        [DataMember(Name = "a")]
        public double ask { get; set; }

        [ProtoMember(4)]
        [JsonProperty("m")]
        [DataMember(Name = "m")]
        public double mid { get; set; }

        [ProtoMember(5)]
        [JsonProperty("v")]
        [DataMember(Name = "v")]
        public string valueDate { get; set; }

        [ProtoMember(6)]
        [JsonProperty("t")]
        [DataMember(Name = "t")]
        public long creationTimestamp { get; set; }
    }

    [ProtoContract]
    public class SpotPriceDto2
    {
        [ProtoMember(1)]
        public string symbol { get; set; }

        [ProtoMember(2)]
        public double bid { get; set; }

        [ProtoMember(3)]
        public double ask { get; set; }

        [ProtoMember(4)]
        public double mid { get; set; }

        [ProtoMember(5)]
        public DateTime valueDate { get; set; }

        [ProtoMember(6)]
        public long creationTimestamp { get; set; }
    }

    public class SpotPriceSerializer
    {
        public static byte[] Serialize(SpotPriceDto spot)
        {
            var str = spot.symbol + "," + spot.bid + "," + spot.ask + "," + spot.mid + "," +
                      spot.valueDate + "," + spot.creationTimestamp;

            return Encoding.UTF8.GetBytes(str);
        }
    }

    public class BasicProto
    {
        [Fact]
        public void ProtoBufPriceDto()
        {
            var aggregate = new SpotPriceDto
            {
                ask = 123.13212,
                bid = 122.12323,
                creationTimestamp = DateTime.Now.ToFileTimeUtc(),
                mid = 103.12132,
                symbol = "EURUSD",
                valueDate = DateTime.Today.ToString("yyyyMMdd")
            };

            var aggregate2 = new SpotPriceDto2
            {
                ask = 123.13212,
                bid = 122.12323,
                creationTimestamp = DateTime.Now.ToFileTimeUtc(),
                mid = 103.12132,
                symbol = "EURUSD",
                valueDate = DateTime.Today
            };

            Console.WriteLine(aggregate2.creationTimestamp.ToString());

            File.WriteAllText(@"c:\temp\example.proto", Serializer.GetProto<SpotPriceDto>());
            

            Console.WriteLine();
            Console.WriteLine("Serializers");
            Console.WriteLine("===========");
            Console.WriteLine();

            using (var mem = new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(aggregate2))))
            {
                mem.Position = 0;
                var payload = new byte[mem.Length];
                mem.Read(payload, 0, (int) mem.Length);

                var spotPrice = JsonConvert.DeserializeObject<SpotPriceDto2>(Encoding.UTF8.GetString(payload));
                Console.WriteLine("JSON/UTF8 Length Normal\t\t\t{0} bytes", mem.Length);
                Assert.Equal(aggregate.ask, spotPrice.ask);
            }


            using (var mem = new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(aggregate))))
            {
                mem.Position = 0;
                var payload = new byte[mem.Length];
                mem.Read(payload, 0, (int) mem.Length);

                var spotPrice = JsonConvert.DeserializeObject<SpotPriceDto>(Encoding.UTF8.GetString(payload));
                Console.WriteLine("JSON/UTF8 Length Reduced Names\t\t{0} bytes", mem.Length);
                Assert.Equal(aggregate.ask, spotPrice.ask);
            }


            using (var mem = new FileStream(@"c:\temp\spot.proto", FileMode.Create))
            {
                Serializer.Serialize(mem, aggregate);
                mem.Position = 0;

                var spotPrice = Serializer.Deserialize<SpotPriceDto>(mem);
                Console.WriteLine("ProtoBuf Length\t\t\t\t{0} bytes", mem.Length);
                Assert.Equal(aggregate.ask, spotPrice.ask);
            }

            var s = SpotPriceSerializer.Serialize(aggregate);
            Console.WriteLine("Custom Length\t\t\t\t{0} bytes", s.Length);

            using (var mem = new MemoryStream())
            {
                var mp = MessagePackSerializer.Get<SpotPriceDto>();
                mp.Pack(mem, aggregate);

                mem.Position = 0;

                Console.WriteLine("MsgPack Length\t\t\t\t{0} bytes", mem.Length);

                var spotPrice = mp.Unpack(mem);

                Assert.Equal(aggregate.ask, spotPrice.ask);
            }

            using (var mem = new FileStream(@"c:\temp\spot.mp", FileMode.Create))
            {

                var context = new SerializationContext
                {
                    SerializationMethod = SerializationMethod.Map,
                    EnumSerializationMethod = EnumSerializationMethod.ByName,
                };
                
                var mp = context.GetSerializer<SpotPriceDto>();
                
                mp.Pack(mem, aggregate);

                mem.Position = 0;

                Console.WriteLine("MsgPack Length Normal Name\t\t{0} bytes", mem.Length);

                var spotPrice = mp.Unpack(mem);
                
                Assert.Equal(aggregate.ask, spotPrice.ask);
            }

            Console.WriteLine();
            Console.WriteLine();
        }
    }
}
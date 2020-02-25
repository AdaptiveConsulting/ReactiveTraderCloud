using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Adaptive.ReactiveTrader.Contract
{
    public class TradeDto
    {
        public long TradeId { get; set; }
        public string TraderName { get; set; }
        public string CurrencyPair { get; set; }
        public decimal Notional { get; set; }
        public string DealtCurrency { get; set; }

        [JsonConverter(typeof (StringEnumConverter))]
        public DirectionDto Direction { get; set; }

        public decimal SpotRate { get; set; }
        public DateTimeOffset TradeDate { get; set; }
        public DateTimeOffset ValueDate { get; set; }

        [JsonConverter(typeof (StringEnumConverter))]
        public TradeStatusDto Status { get; set; }

        public override string ToString()
        {
            return
                $"TradeId: {TradeId}, TraderName: {TraderName}, CurrencyPair: {CurrencyPair}, Notional: {Notional}, Direction: {Direction}, SpotRate: {SpotRate}, TradeDate: {TradeDate}, ValueDate: {ValueDate}, Status: {Status}, DealtCurrency: {DealtCurrency}";
        }
    }
}

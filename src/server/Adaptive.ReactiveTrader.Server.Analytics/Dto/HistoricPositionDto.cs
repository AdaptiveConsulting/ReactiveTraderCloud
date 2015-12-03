using System;

namespace Adaptive.ReactiveTrader.Server.Analytics.Dto
{
    public class HistoricPositionDto
    {
        public DateTimeOffset Timestamp { get; set; }
        public decimal UsdPnl { get; set; }

        public override string ToString()
        {
            return $"Timestamp: {Timestamp}, UsdPnl: {UsdPnl}";
        }
    }
}
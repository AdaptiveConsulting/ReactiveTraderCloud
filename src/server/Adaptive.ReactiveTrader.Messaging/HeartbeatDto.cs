using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class HeartbeatDto
    {
        public string Type { get; set; }
        public Guid Instance { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
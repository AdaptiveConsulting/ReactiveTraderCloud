using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    public class ServiceStatusDto
    {
        public string Type { get; set; }
        public string Instance { get; set; }
        public DateTime Timestamp { get; set; }
        public double Load { get; set; }
    }
}
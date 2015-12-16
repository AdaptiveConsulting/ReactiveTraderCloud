using Microsoft.Framework.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class EventStoreConfiguration : IEventStoreConfiguration
    {
        public EventStoreConfiguration(IConfiguration eventStoreSection)
        {
            Host = eventStoreSection.GetStringValue("host", "localhost");
            Port = eventStoreSection.GetIntValue("port", 1113);
            Embedded = eventStoreSection.GetStringValue("embedded") == "true";
        }

        public string Host { get; }
        public int Port { get; }
        public bool Embedded { get; }
    }
}
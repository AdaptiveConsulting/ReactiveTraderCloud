using Microsoft.Framework.Configuration;

namespace Adaptive.ReactiveTrader.Server.Common.Config
{
    public interface IEventStoreConfiguration
    {
        string Host { get; }
        int Port { get; }
    }

    internal class EventStoreConfiguration : IEventStoreConfiguration
    {
        public EventStoreConfiguration(IConfiguration eventStoreSection)
        {
            Host = eventStoreSection.GetStringValue("host", "localhost");
            Port = eventStoreSection.GetIntValue("port", 1113);
        }

        public string Host { get; }
        public int Port { get; }
    }
}
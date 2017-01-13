using Microsoft.Extensions.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class EventStoreConfiguration : IEventStoreConfiguration
    {
        public EventStoreConfiguration(IConfiguration eventStoreSection)
        {
            Host = eventStoreSection["host"] ?? "localhost";
            int port;
            Port = int.TryParse(eventStoreSection["port"], out port) ? port : 1113;
        }

        public string Host { get; }
        public int Port { get; }
    }
}
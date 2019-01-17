using Microsoft.Extensions.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class EventStoreConfiguration : IEventStoreConfiguration
    {
        public EventStoreConfiguration(IConfiguration eventStoreSection)
        {
            var envHost = System.Environment.GetEnvironmentVariable("EVENTSTORE_HOST");
            var envPort = System.Environment.GetEnvironmentVariable("EVENTSTORE_PORT");

            Host = envHost != null ? envHost : eventStoreSection.GetStringValue("host", "localhost");
            Port = envPort != null && System.Int32.TryParse(envPort, out int j) ? j : eventStoreSection.GetIntValue("port", 1113);
        }

        public string Host { get; }
        public int Port { get; }
    }
}

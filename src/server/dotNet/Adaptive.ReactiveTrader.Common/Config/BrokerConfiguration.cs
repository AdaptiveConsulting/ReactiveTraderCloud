using Microsoft.Extensions.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class BrokerConfiguration : IBrokerConfiguration
    {
        public BrokerConfiguration(IConfiguration brokerSection)
        {
            var envHost = System.Environment.GetEnvironmentVariable("BROKER_HOST");
            var envPort = System.Environment.GetEnvironmentVariable("BROKER_PORT");

            Host = envHost != null ? envHost : brokerSection.GetStringValue("host", "localhost");
            Port = envPort != null && System.Int32.TryParse(envPort, out int j) ? j : brokerSection.GetIntValue("port", 8000);

            Realm = brokerSection.GetStringValue("realm", "com.weareadaptive.reactivetrader");
        }

        public string Host { get; }
        public int Port { get; }
        public string Realm { get; }
    }
}

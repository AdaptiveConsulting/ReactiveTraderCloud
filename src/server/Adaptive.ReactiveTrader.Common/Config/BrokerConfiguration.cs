using Microsoft.Extensions.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class BrokerConfiguration : IBrokerConfiguration
    {
        public BrokerConfiguration(IConfiguration brokerSection)
        {
            Host = brokerSection["host"] ?? "localhost";
            int port;
            Port = int.TryParse(brokerSection["port"], out port) ? port : 8080;
            Realm = brokerSection["realm"] ?? "com.weareadaptive.reactivetrader";
        }

        public string Host { get; }
        public int Port { get; }
        public string Realm { get; }
    }
}
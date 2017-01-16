using Microsoft.Extensions.Configuration;

namespace Adaptive.ReactiveTrader.Common.Config
{
    internal class BrokerConfiguration : IBrokerConfiguration
    {
        public BrokerConfiguration(IConfiguration brokerSection)
        {
            Host = brokerSection.GetStringValue("host", "localhost");
            Port = brokerSection.GetIntValue("port", 8080);
            Realm = brokerSection.GetStringValue("realm", "com.weareadaptive.reactivetrader");
        }

        public string Host { get; }
        public int Port { get; }
        public string Realm { get; }
    }
}
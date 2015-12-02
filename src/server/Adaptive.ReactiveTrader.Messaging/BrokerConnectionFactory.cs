using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerConnectionFactory
    {
        public static IBrokerConnection Create(IBrokerConfiguration config)
        {
            return new BrokerConnection(BrokerUri.FromConfig(config), config.Realm);
        }
    }
}
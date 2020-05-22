using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerConnectionFactory
    {
        public static RabbitMQConnection Create(IBrokerConfiguration config) => new RabbitMQConnection(config.Host, config.Port);
    }
}

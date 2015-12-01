using System.Net.Sockets;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Server.Common.Config;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerFactory
    {
        public static async Task<IBroker> Create(IBrokerConfiguration config)
        {
            try
            {
                var broker = new Broker(BrokerUri.FromConfig(config), config.Realm);
                await broker.Open();
                return broker;
            }
            catch (SocketException e)
            {
                throw new MessagingException("Could not connect to Message Broker", e);
            }
        }
    }
}
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerFactory
    {
        public static async Task<IBroker> Create(string uri, string realm)
        {
            try
            {
                var broker = new Broker(uri, realm);
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
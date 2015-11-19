using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public static class BrokerFactory
    {
        public static async Task<IBroker> Create(string uri, string realm)
        {
            var broker = new Broker(uri, realm);
            await broker.Open();
            return broker;
        }
    }
}
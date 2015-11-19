using System.Threading.Tasks;
using WampSharp.V2.Realm;

namespace Adaptive.ReactiveTrader.Transport
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
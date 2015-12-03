using System.Threading.Tasks;
using WampSharp.V2;
using WampSharp.V2.Client;
using WampSharp.V2.Fluent;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class TestBroker
    {
        private readonly IWampChannel _channel;
        public TestBroker()
        {
            _channel = new WampChannelFactory()
                .ConnectToRealm("com.weareadaptive.reactivetrader")
                .WebSocketTransport($"ws://{IntegrationTestAddress.Url}:8080/ws")
                .MsgpackSerialization()
                .Build();
        }

        public async Task<IWampChannel> OpenChannel()
        {
            await _channel.Open();
            return _channel;
        }
    }
}
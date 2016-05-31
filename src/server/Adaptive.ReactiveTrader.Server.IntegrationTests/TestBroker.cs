using System.Threading.Tasks;
using WampSharp.V2;
using WampSharp.V2.Client;
using WampSharp.V2.Fluent;
using WampSharp.WebsocketsPcl;
using WampSharp.WebsocketsPcl.Websockets;
using Adaptive.ReactiveTrader.Messaging.WebSocket;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class TestBroker
    {
        private readonly IWampChannel _channel;

        public TestBroker()
        {
            WebSocketFactory.Init(() => new ClientWebSocketConnection());
            _channel = new WampChannelFactory()
                .ConnectToRealm("com.weareadaptive.reactivetrader")
                .WebSocketTransport(TestAddress.Broker)
                .JsonSerialization()
                .Build();
        }

        public async Task<IWampChannel> OpenChannel()
        {
            await _channel.Open();
            return _channel;
        }
    }
}
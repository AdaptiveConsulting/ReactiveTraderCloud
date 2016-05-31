using System;
using WampSharp.WebsocketsPcl.Websockets;

namespace Adaptive.ReactiveTrader.Messaging.WebSocket
{
    public class ClientWebSocketConnection : IWebSocketConnection
    {
        private ClientWebSocketWrapper _clientWebSocketConnection;

        public bool IsOpen => _clientWebSocketConnection.IsConnected();

        public event Action OnOpened;
        public event Action OnClosed;
        public event Action<IWebSocketConnection> OnDispose;
        public event Action<string> OnError;
        public event Action<string> OnMessage;
        public event Action<string> OnLog;

        public void Open(string url, string protocol = null)
        {
            _clientWebSocketConnection = ClientWebSocketWrapper.Create(url);
            _clientWebSocketConnection.OnConnect(_ => OnOpened?.Invoke());
            _clientWebSocketConnection.OnDisconnect(_ => OnClosed?.Invoke());
            _clientWebSocketConnection.OnMessage((s, _) => OnMessage?.Invoke(s));
            _clientWebSocketConnection.Connect().Wait();
        }

        public void Close()
        {
            _clientWebSocketConnection.Disconnect();
        }

        public void Send(string message)
        {
            _clientWebSocketConnection.SendMessage(message);
        }

        public void Dispose()
        {
            OnDispose?.Invoke(this);
        }
    }
}
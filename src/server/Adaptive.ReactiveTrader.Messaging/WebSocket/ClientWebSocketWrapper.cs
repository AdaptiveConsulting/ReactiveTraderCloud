using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging.WebSocket
{
    public class ClientWebSocketWrapper
    {
        private const int ReceiveChunkSize = 1024;
        private const int SendChunkSize = 1024;

        private readonly ClientWebSocket _ws;
        private readonly Uri _uri;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly CancellationToken _cancellationToken;

        private Action<ClientWebSocketWrapper> _onConnected;
        private Action<string, ClientWebSocketWrapper> _onMessage;
        private Action<ClientWebSocketWrapper> _onDisconnected;

        protected ClientWebSocketWrapper(string uri)
        {
            _ws = new ClientWebSocket();
            _ws.Options.KeepAliveInterval = TimeSpan.FromSeconds(20);
            _ws.Options.AddSubProtocol("wamp.2.json");
            _uri = new Uri(uri);
            _cancellationToken = _cancellationTokenSource.Token;
        }

        public static ClientWebSocketWrapper Create(string uri)
        {
            return new ClientWebSocketWrapper(uri);
        }

        public async Task Connect()
        {
            await _ws.ConnectAsync(_uri, _cancellationToken);
            CallOnConnected();
            StartListen();
        }

        public Task Disconnect()
        {
            return _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "NormalClosure", CancellationToken.None);
        }

        public bool IsConnected()
        {
            return _ws.State == WebSocketState.Open;
        }

        public void OnConnect(Action<ClientWebSocketWrapper> onConnect)
        {
            _onConnected = onConnect;
        }

        public void OnDisconnect(Action<ClientWebSocketWrapper> onDisconnect)
        {
            _onDisconnected = onDisconnect;
        }

        public void OnMessage(Action<string, ClientWebSocketWrapper> onMessage)
        {
            _onMessage = onMessage;
        }

        public Task SendMessage(string message)
        {
            return SendMessageAsync(message);
        }

        private async Task SendMessageAsync(string message)
        {
            if (_ws.State != WebSocketState.Open)
            {
                throw new Exception("Connection is not open.");
            }

            var messageBuffer = Encoding.UTF8.GetBytes(message);
            var messagesCount = (int)Math.Ceiling((double)messageBuffer.Length / SendChunkSize);

            for (var i = 0; i < messagesCount; i++)
            {
                var offset = (SendChunkSize * i);
                var count = SendChunkSize;
                var lastMessage = ((i + 1) == messagesCount);

                if ((count * (i + 1)) > messageBuffer.Length)
                {
                    count = messageBuffer.Length - offset;
                }

                await _ws.SendAsync(new ArraySegment<byte>(messageBuffer, offset, count), WebSocketMessageType.Text, lastMessage, _cancellationToken);
            }
        }

        private async void StartListen()
        {
            var buffer = new byte[ReceiveChunkSize];

            try
            {
                while (_ws.State == WebSocketState.Open)
                {
                    var stringResult = new StringBuilder();

                    WebSocketReceiveResult result;
                    do
                    {
                        result = await _ws.ReceiveAsync(new ArraySegment<byte>(buffer), _cancellationToken);

                        if (result.MessageType == WebSocketMessageType.Close)
                        {
                            await
                                _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                            CallOnDisconnected();
                        }
                        else
                        {
                            var str = Encoding.UTF8.GetString(buffer, 0, result.Count);
                            stringResult.Append(str);
                        }

                    } while (!result.EndOfMessage);

                    CallOnMessage(stringResult);

                }
            }
            catch (Exception)
            {
                CallOnDisconnected();
            }
            finally
            {
                _ws.Dispose();
            }
        }

        private void CallOnMessage(StringBuilder stringResult)
        {
            if (_onMessage != null)
                RunInTask(() => _onMessage(stringResult.ToString(), this));
        }

        private void CallOnDisconnected()
        {
            if (_onDisconnected != null)
                RunInTask(() => _onDisconnected(this));
        }

        private void CallOnConnected()
        {
            if (_onConnected != null)
                RunInTask(() => _onConnected(this));
        }

        private static void RunInTask(Action action)
        {
            Task.Run(action);
        }
    }
}
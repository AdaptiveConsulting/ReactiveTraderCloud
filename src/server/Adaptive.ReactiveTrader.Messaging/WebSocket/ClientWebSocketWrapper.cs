using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging.WebSocket
{
    public class ClientWebSocketWrapper
    {
        private const int ReceiveChunkSize = 1024;
        private const int SendChunkSize = 1024;
        private const string SubProtocol = "wamp.2.json";
        private readonly TimeSpan _keepAliveInterval = TimeSpan.FromSeconds(20);

        private readonly ClientWebSocket _ws;
        private readonly Uri _uri;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly CancellationToken _cancellationToken;

        private Action<ClientWebSocketWrapper> _onConnected;
        private Action<string, ClientWebSocketWrapper> _onMessage;
        private Action<ClientWebSocketWrapper> _onDisconnected;
        private readonly AsyncLock _lock = new AsyncLock();

        protected ClientWebSocketWrapper(string uri)
        {
            _ws = new ClientWebSocket
            {
                Options =
                {
                    KeepAliveInterval = _keepAliveInterval
                }
            };
            
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

        public async Task SendMessage(string message)
        {
            using (await _lock.LockAsync())
            {
                await SendMessageAsync(message);
            }
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
                            Log.Warning(
                                "Close websocket message received. Close Status: {closeStatus} Close Description: {closeDescription}",
                                result.CloseStatus?.ToString(), result.CloseStatusDescription);

                            await _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                            CallOnDisconnected();
                        }
                        else
                        {
                            var str = Encoding.UTF8.GetString(buffer, 0, result.Count);
                            stringResult.Append(str);
                        }

                    } while (!result.EndOfMessage);

                    var message = stringResult.ToString();

                    if (string.IsNullOrWhiteSpace(message))
                    {
                        Log.Warning("Received empty message of type {msgType}", result.MessageType.ToString());
                    }
                    else
                    {
                        CallOnMessage(message);
                    }
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

        private void CallOnMessage(string message)
        {
            if (_onMessage != null)
                Task.Run(() => _onMessage(message, this));
        }

        private void CallOnDisconnected()
        {
            if (_onDisconnected != null)
                Task.Run(() => _onDisconnected(this));
        }

        private void CallOnConnected()
        {
            if (_onConnected != null)
                Task.Run(() => _onConnected(this));
        }
    }
}
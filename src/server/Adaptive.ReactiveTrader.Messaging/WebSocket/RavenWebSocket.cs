using System;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging.WebSocket;

namespace Raven.Client.Platform
{
    // Taken from https://github.com/dotnet/corefx/issues/2486
    public class RavenClientWebSocket : IDisposable
    {
        private RavenUnixClientWebSocket unixInstance;
        private ClientWebSocket winInstance;

        public RavenClientWebSocket()
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                unixInstance = new RavenUnixClientWebSocket();
            else
            {
                winInstance = new ClientWebSocket();
                winInstance.Options.AddSubProtocol("wamp.2.json");
                winInstance.Options.KeepAliveInterval = TimeSpan.FromSeconds(20);
            }
        }

        public WebSocketState State
        {
            get
            {
                if (Sparrow.Platform.Platform.RunningOnPosix)
                    return unixInstance.State;
                return winInstance.State;
            }
        }

        public async Task ConnectAsync(Uri uri, CancellationToken token)
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                await unixInstance.ConnectAsync(uri, token);
            else
                await winInstance.ConnectAsync(uri, token);
        }

        public async Task<WebSocketReceiveResult> ReceiveAsync(ArraySegment<byte> arraySegment, CancellationToken token)
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                return await unixInstance.ReceiveAsync(arraySegment, token);
            return await winInstance.ReceiveAsync(arraySegment, token);
        }

        public async Task CloseOutputAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken token)
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                await unixInstance.CloseOutputAsync(closeStatus, statusDescription, token);
            else
                await winInstance.CloseOutputAsync(closeStatus, statusDescription, token);
        }

        public async Task SendAsync(ArraySegment<byte> segment, WebSocketMessageType messageType, bool endOfMessage, CancellationToken token)
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                await unixInstance.SendAsync(segment, messageType, endOfMessage, token);
            else
                await winInstance.SendAsync(segment, messageType, endOfMessage, token);
        }

        public void Dispose()
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                unixInstance.Dispose();
            else
                winInstance.Dispose();
        }

        public async Task CloseAsync(WebSocketCloseStatus closeStatus, string statusDescription, CancellationToken token)
        {
            if (Sparrow.Platform.Platform.RunningOnPosix)
                await unixInstance.CloseAsync(closeStatus, statusDescription, token);
            else
                await winInstance.CloseAsync(closeStatus, statusDescription, token);
        }
    }
}

namespace Sparrow.Platform
{
    public static class Platform
    {
        public static readonly bool RunningOnPosix = RuntimeInformation.IsOSPlatform(OSPlatform.Linux) ||
                                                     RuntimeInformation.IsOSPlatform(OSPlatform.OSX);
    }
}
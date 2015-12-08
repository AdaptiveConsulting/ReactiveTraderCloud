using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading.Tasks;
using WampSharp.V2;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public static class TestHelpers
    {
        public static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);
        public const string BrokerUrl = "ws://127.0.0.1:8080/ws";

        public static async Task<string> GetServiceInstance(this IWampChannel channel, string serviceType)
        {
            var heartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(hb => hb.Type == serviceType)
                .Take(1)
                .ToTask();

            return heartbeat.Instance;
        }
    }
}
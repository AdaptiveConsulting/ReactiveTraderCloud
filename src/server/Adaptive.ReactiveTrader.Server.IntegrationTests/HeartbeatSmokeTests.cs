using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class HeartbeatSmokeTests
    {
        private readonly TestBroker _broker;

        public HeartbeatSmokeTests()
        {
            _broker = new TestBroker();
        }

        //[Theory]
        //[InlineData(ServiceTypes.Reference)]
        //[InlineData(ServiceTypes.Pricing)]
        //[InlineData(ServiceTypes.Execution)]
        //[InlineData(ServiceTypes.Blotter)]
        //[InlineData(ServiceTypes.Analytics)]
        public async void ShouldReceiveHeartbeatForServices(string serviceType)
        {
            var channel = await _broker.OpenChannel();

            var heartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(hb => hb.Type == serviceType)
                .Timeout(TimeSpan.FromSeconds(2))
                .Take(1)
                .ToTask();

            Assert.NotNull(heartbeat);
        }
    }
}

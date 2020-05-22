using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Common;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class HeartbeatSmokeTests
    {
        [Theory]
        [InlineData(ServiceTypes.Reference)]
        [InlineData(ServiceTypes.Pricing)]
        [InlineData(ServiceTypes.Execution)]
        [InlineData(ServiceTypes.Blotter)]
        [InlineData(ServiceTypes.Analytics)]
        public async void ShouldReceiveHeartbeatForServices(string serviceType)
        {
            var broker = new TestBroker();

            var heartbeat = await broker.SubscribeToTopic<dynamic>("status")
                                         .Where(hb => hb.Type == serviceType)
                                         .Timeout(TimeSpan.FromSeconds(10))
                                         .Take(1);

            Assert.NotNull(heartbeat.Instance);

        }
    }
}


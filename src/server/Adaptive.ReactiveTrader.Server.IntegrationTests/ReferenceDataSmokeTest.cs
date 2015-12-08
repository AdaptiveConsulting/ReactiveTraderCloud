using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Common.Logging;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ReferenceDataSmokeTest
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataSmokeTest>();

        private readonly TestBroker _broker;

        public ReferenceDataSmokeTest()
        {
            _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldContainSomeReferenceData()
        {
            var pass = false;

            Log.Info("Starting ShouldContainSomeReferenceData test");

            var channel = await _broker.OpenChannel();

            Log.Info("Opened channel to broker");

            var refHeartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(heartbeat => heartbeat.Type == "reference")
                .Take(1)
                .ToTask();

            Log.Info("Got reference svc heartbeat, instance: " + refHeartbeat.Instance);
            Log.Info("Calling get reference data");

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            Action<dynamic> callback = d =>
            {
                var updates = d as dynamic[];

                if (updates == null || updates.Length == 0)
                    return;

                foreach (var x in updates)
                {
                    Console.WriteLine(x);
                }

                pass = true;


                Console.WriteLine("All OK, cancelling timeout");
                timeoutCancellationTokenSource.Cancel(false);
            };

            dynamic dto = new
            {
                ReplyTo = "refSmokeTest",
                Payload = new NothingDto()
            };

            await channel.RealmProxy.TopicContainer.GetTopicByUri("refSmokeTest").Subscribe(new WampSubscriber(callback), new SubscribeOptions());

            channel.RealmProxy.RpcCatalog.Invoke(new RpcCallback(() => { }), new CallOptions(),
                $"{refHeartbeat.Instance}.getCurrencyPairUpdatesStream", new[] { dto });

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(10), timeoutCancellationTokenSource.Token);
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(pass);
        }
    }
}
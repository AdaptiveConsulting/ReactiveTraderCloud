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

            var testReplyTo = "referenceDataSmokeTest";

            var channel = await _broker.OpenChannel();

            var serviceInstance = await channel.GetServiceInstance("reference");

            Log.Info("Got reference svc heartbeat, instance: " + serviceInstance);

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
                timeoutCancellationTokenSource.Cancel(false);
            };

            dynamic dto = new
            {
                ReplyTo = testReplyTo,
                Payload = new NothingDto()
            };

            await channel.RealmProxy.TopicContainer
                .GetTopicByUri(testReplyTo)
                .Subscribe(new WampSubscriber(callback), new SubscribeOptions());

            channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{serviceInstance}.getCurrencyPairUpdatesStream",
                new object[] {dto});

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(10), timeoutCancellationTokenSource.Token);
                Console.WriteLine("Test timed out after 10 seconds");
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(pass);
        }
    }
}
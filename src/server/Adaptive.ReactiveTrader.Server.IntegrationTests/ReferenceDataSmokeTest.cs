using System;
using System.Reactive.Linq;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ReferenceDataSmokeTest
    {
        private static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);

        [Fact]
        public async void ShouldContainSomeReferenceData()
        {
            var pass = false;
            var testReplyTo = "referenceDataSmokeTest";

            var channel = await new TestBroker().OpenChannel();

            var serviceInstance = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                                               .Where(hb => hb.Type == ServiceTypes.Reference)
                                               .Select(hb => hb.Instance)
                                               .Take(1);

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
                await Task.Delay(ResponseTimeout, timeoutCancellationTokenSource.Token);
                Console.WriteLine($"Test timed out after {ResponseTimeout.TotalSeconds} seconds");
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(pass);
        }
    }
}
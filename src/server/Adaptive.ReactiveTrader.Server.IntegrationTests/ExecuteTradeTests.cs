using System;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecuteTradeTests
    {
        private readonly TestBroker _broker;
        private const string BlotterUpdatesReplyTo = "blotterReplyTo";
        private const string TestCcyPair = "XXXYYY";

        public ExecuteTradeTests()
        {
            _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            var pass = false;

            var channel = await _broker.OpenChannel();

            var executionServiceInstance = await channel.GetServiceInstance("execution");
            var blotterServiceInstance = await channel.GetServiceInstance("blotter");

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            // this is the callback when the blotter receives the executed trade notification
            Action<dynamic> blotterCallbackAssertion = d =>
            {
                foreach (var dto in d)
                {
                    foreach (var trade in dto.Trades)
                    {
                        if (trade.CurrencyPair == TestCcyPair && trade.Status == "Done")
                        {
                            Console.WriteLine(dto);
                            // set the assertion
                            pass = true;
                            timeoutCancellationTokenSource.Cancel(false);
                            return;
                        }
                    }
                }
            };

            await channel.RealmProxy.TopicContainer
                .GetTopicByUri(BlotterUpdatesReplyTo)
                .Subscribe(new WampSubscriber(blotterCallbackAssertion), new SubscribeOptions());

            // subscribe to blotter with the callback
            channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{blotterServiceInstance}.getTradesStream",
                new object[] { new { ReplyTo = BlotterUpdatesReplyTo, Payload = new NothingDto() } });

            // call execute trade
            channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{executionServiceInstance}.executeTrade",
                new object[]
                {
                        new
                        {
                            ReplyTo = "_", // ignored
                            Payload = new ExecuteTradeRequestDto
                            {
                                CurrencyPair = TestCcyPair,
                                DealtCurrency = "XXX",
                                Direction = DirectionDto.Buy,
                                Notional = 1000000,
                                SpotRate = 1m,
                                ValueDate = DateUtils.ToSerializationFormat(DateTime.UtcNow.AddDays(2))
                            }
                        }
                });

            try
            {
                // set timeout
                await Task.Delay(TestHelpers.ResponseTimeout, timeoutCancellationTokenSource.Token);
                Console.WriteLine($"Test timed out after {TestHelpers.ResponseTimeout.TotalSeconds} seconds");
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(pass);
        }
    }
}
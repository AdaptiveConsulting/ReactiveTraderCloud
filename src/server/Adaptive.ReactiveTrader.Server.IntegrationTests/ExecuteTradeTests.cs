using System;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecuteTradeTests
    {
        private readonly IWampChannel _channel;
        private readonly string _executionServiceInstance;
        private string _blotterServiceInstance;
        private string _analyticsServiceInstance;
        private readonly CancellationTokenSource _timeoutCancellationTokenSource;
        private const string BlotterUpdatesReplyTo = "blotterReplyTo";
        private const string AnalyticsUpdatesReplyTo = "analyticsReplyTo";

        public ExecuteTradeTests()
        {
            var broker = new TestBroker();
            _channel = broker.OpenChannel().Result;
            _executionServiceInstance = _channel.GetServiceInstance("execution").Result;
            _timeoutCancellationTokenSource = new CancellationTokenSource();
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            var pass = false;
            var testCcyPair = "XXXXXB";

            _blotterServiceInstance = await _channel.GetServiceInstance("blotter");

            // this is the callback when the blotter receives the executed trade notification
            Action<dynamic> blotterCallbackAssertion = d =>
            {
                foreach (var dto in d)
                {
                    foreach (var trade in dto.Trades)
                    {
                        if (trade.CurrencyPair == testCcyPair && trade.Status == "Done")
                        {
                            Console.WriteLine(dto);
                            // set the assertion
                            pass = true;
                            _timeoutCancellationTokenSource.Cancel(false);
                            return;
                        }
                    }
                }
            };

            await _channel.RealmProxy.TopicContainer
                .GetTopicByUri(BlotterUpdatesReplyTo)
                .Subscribe(new WampSubscriber(blotterCallbackAssertion), new SubscribeOptions());

            // subscribe to blotter with the callback
            _channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{_blotterServiceInstance}.getTradesStream",
                new object[] { new { ReplyTo = BlotterUpdatesReplyTo, Payload = new NothingDto() } });

            // call execute trade
            await CallExecuteTrade(testCcyPair);

            Assert.True(pass);
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInAnalytics()
        {
            var pass = false;
            var testCcyPair = "XXXXXA";

            _analyticsServiceInstance = await _channel.GetServiceInstance("analytics");

            // this is the callback when the blotter receives the executed trade notification
            Action<dynamic> analyticsCallbackAssertion = d =>
            {
                            Console.WriteLine(d);
                            // set the assertion
                            pass = true;
                            _timeoutCancellationTokenSource.Cancel(false);
            };

            await _channel.RealmProxy.TopicContainer
                .GetTopicByUri(AnalyticsUpdatesReplyTo)
                .Subscribe(new WampSubscriber(analyticsCallbackAssertion), new SubscribeOptions());

            // subscribe to blotter with the callback
            _channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{_analyticsServiceInstance}.getAnalytics",
                new object[] { new { ReplyTo = AnalyticsUpdatesReplyTo, Payload = new NothingDto() } });

            // call execute trade
            await CallExecuteTrade(testCcyPair);

            Assert.True(pass);
        }

        private async Task CallExecuteTrade(string testCcyPair)
        {
            // call execute trade
            _channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{_executionServiceInstance}.executeTrade",
                new object[]
                {
                    new
                    {
                        ReplyTo = "_", // ignored
                        Payload = new ExecuteTradeRequestDto
                        {
                            CurrencyPair = testCcyPair,
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
                await Task.Delay(TestHelpers.ResponseTimeout, _timeoutCancellationTokenSource.Token);
                Console.WriteLine($"Test timed out after {TestHelpers.ResponseTimeout.TotalSeconds} seconds");
            }
            catch (TaskCanceledException)
            {
            }
        }
    }
}
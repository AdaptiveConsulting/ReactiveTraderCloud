using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecuteTradeIntegrationTests
    {
        private static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);

        private readonly IWampChannel _channel;
        private readonly string _executionServiceInstance;
        private string _blotterServiceInstance;
        private string _analyticsServiceInstance;
        private readonly CancellationTokenSource _timeoutCancellationTokenSource;
        private readonly IObservable<dynamic> _heartbeatStream;
        private const string BlotterUpdatesReplyTo = "blotterReplyTo";
        private const string AnalyticsUpdatesReplyTo = "analyticsReplyTo";

        public ExecuteTradeIntegrationTests()
        {
            var broker = new TestBroker();
            _channel = broker.OpenChannel().Result;

            _heartbeatStream = _channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Publish()
                .RefCount();

            _executionServiceInstance = _heartbeatStream
                .Where(hb => hb.Type == ServiceTypes.Execution)
                .Select(hb => hb.Instance)
                .Take(1)
                .ToTask()
                .Result;

            _timeoutCancellationTokenSource = new CancellationTokenSource();
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            var pass = false;
            var testCcyPair = "XXXXXB";

            _blotterServiceInstance = await _heartbeatStream
                .Where(hb => hb.Type == ServiceTypes.Blotter)
                .Select(hb => hb.Instance)
                .Take(1);

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

            _analyticsServiceInstance = await _heartbeatStream
                .Where(hb => hb.Type == ServiceTypes.Analytics)
                .Select(hb => hb.Instance)
                .Take(1);

            // this is the callback when the analytics svc receives the executed trade notification
            Action<dynamic> analyticsCallbackAssertion = d =>
            {
                foreach (var dto in d)
                {
                    foreach (var currentPosition in dto.CurrentPositions)
                    {
                        if (currentPosition.Symbol == testCcyPair)
                        {
                            Console.WriteLine(currentPosition);
                            // set the assertion
                            pass = true;
                            _timeoutCancellationTokenSource.Cancel(false);
                        }
                    }
                }
            };

            await _channel.RealmProxy.TopicContainer
                .GetTopicByUri(AnalyticsUpdatesReplyTo)
                .Subscribe(new WampSubscriber(analyticsCallbackAssertion), new SubscribeOptions());

            // subscribe to analytics with the callback
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
                await Task.Delay(ResponseTimeout, _timeoutCancellationTokenSource.Token);
                Console.WriteLine($"Test timed out after {ResponseTimeout.TotalSeconds} seconds");
            }
            catch (TaskCanceledException)
            {
            }
        }
    }
}
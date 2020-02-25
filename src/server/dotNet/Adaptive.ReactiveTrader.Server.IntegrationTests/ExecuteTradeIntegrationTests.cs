using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
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
        private const string BlotterUpdatesReplyTo = "blotterReplyTo";
        private const string AnalyticsUpdatesReplyTo = "analyticsReplyTo";
        private static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);

        private readonly IWampChannel _channel;
        private readonly string _executionServiceInstance;
        private readonly IObservable<dynamic> _heartbeatStream;

        public ExecuteTradeIntegrationTests()
        {
            var broker = new TestBroker();
            _channel = broker.OpenChannel().Result;

            _heartbeatStream = _channel.RealmProxy.Services.GetSubject<dynamic>("status")
                                       .Publish()
                                       .RefCount();

            _executionServiceInstance = GetInstanceName(ServiceTypes.Execution).Result;
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            var testCcyPair = "XXXXXB";
            var asyncAssertion = new TaskCompletionSource<bool>();
            var blotterServiceInstance = await GetInstanceName(ServiceTypes.Blotter);

            // this is the callback when the blotter receives the executed trade notification
            void BlotterCallbackAssertion(dynamic d)
            {
                foreach (var dto in d)
                {
                    foreach (var trade in dto.Trades)
                    {
                        if (trade.CurrencyPair == testCcyPair && trade.Status == "Done")
                        {
                            Console.WriteLine(dto);
                            // set the assertion
                            asyncAssertion.SetResult(true);
                            return;
                        }
                    }
                }
            }

            await SetupAssertionListener(BlotterUpdatesReplyTo, BlotterCallbackAssertion);

            // subscribe to blotter with the callback
            Subscribe(blotterServiceInstance, "getTradesStream", BlotterUpdatesReplyTo);

            CallExecuteTrade(testCcyPair);

            var pass = await asyncAssertion.Task.ToObservable().Timeout(ResponseTimeout, Observable.Return(false)).Take(1);

            Assert.True(pass);
        }


        [Fact]
        public async void ShouldReceiveExecutedTradeInAnalytics()
        {
            var testCcyPair = "XXXXXA";
            var asyncAssertion = new TaskCompletionSource<bool>();
            var analyticsServiceInstance = await GetInstanceName(ServiceTypes.Analytics);

            // this is the callback when the analytics svc receives the executed trade notification
            void AnalyticsCallbackAssertion(dynamic d)
            {
                foreach (var dto in d)
                {
                    foreach (var currentPosition in dto.CurrentPositions)
                    {
                        if (currentPosition.Symbol == testCcyPair)
                        {
                            Console.WriteLine(currentPosition);
                            // set the assertion
                            asyncAssertion.SetResult(true);
                            return;
                        }
                    }
                }
            }

            await SetupAssertionListener(AnalyticsUpdatesReplyTo, AnalyticsCallbackAssertion);

            // subscribe to analytics with the callback
            Subscribe(analyticsServiceInstance, "getAnalytics", AnalyticsUpdatesReplyTo);

            CallExecuteTrade(testCcyPair);

            var pass = await asyncAssertion.Task.ToObservable().Timeout(ResponseTimeout, Observable.Return(false)).Take(1);

            Assert.True(pass);
        }

        private Task<dynamic> GetInstanceName(string serviceType)
        {
            return _heartbeatStream
                .Where(hb => hb.Type == serviceType)
                .Select(hb => hb.Instance.ToString())
                .Take(1)
                .Timeout(ResponseTimeout)
                .ToTask();
        }

        private async Task SetupAssertionListener(string topic, Action<dynamic> callbackAssertion)
        {
            await _channel.RealmProxy.TopicContainer
                .GetTopicByUri(topic)
                .Subscribe(new WampSubscriber(callbackAssertion), new SubscribeOptions());
        }

        private void Subscribe(string instanceName, string methodName, string replyTo)
        {
            _channel.RealmProxy.RpcCatalog.Invoke(
                new RpcCallback(() => { }),
                new CallOptions(),
                $"{instanceName}.{methodName}",
                new object[] { new { ReplyTo = replyTo, Payload = new NothingDto() } });
        }

        private void CallExecuteTrade(string testCcyPair)
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
        }
    }
}

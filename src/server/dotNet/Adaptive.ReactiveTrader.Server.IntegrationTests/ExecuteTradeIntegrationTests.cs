using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecuteTradeIntegrationTests
    {
        private static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);
        private readonly TestBroker _broker;

        public ExecuteTradeIntegrationTests()
        {
             _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInBlotter()
        {
            const string testCcyPair = "XXXXXB";
            var asyncAssertion = new TaskCompletionSource<bool>();

            // this is the callback when the blotter receives the executed trade notification
            void BlotterCallbackAssertion(dynamic d)
            {
                foreach (var trade in d.Trades)
                {
                    if (trade.CurrencyPair == testCcyPair && trade.Status == "Done")
                    {
                        Console.WriteLine(d);
                        // set the assertion
                        asyncAssertion.SetResult(true);
                        return;
                    }
                }
            }

            await _broker.RpcCall<dynamic, NothingDto>(ServiceTypes.Blotter, "getTradesStream", new NothingDto(), BlotterCallbackAssertion);

            await CallExecuteTrade(testCcyPair);

            var pass = await asyncAssertion.Task.ToObservable().Timeout(ResponseTimeout, Observable.Return(false)).Take(1);

            Assert.True(pass);
        }

        [Fact]
        public async void ShouldReceiveExecutedTradeInAnalytics()
        {
            const string testCcyPair = "XXXXXA";
            var asyncAssertion = new TaskCompletionSource<bool>();

            // this is the callback when the analytics svc receives the executed trade notification
            void AnalyticsCallbackAssertion(dynamic d)
            {
                foreach (var currentPosition in d.CurrentPositions)
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

            await _broker.RpcCall<dynamic, NothingDto>(ServiceTypes.Analytics, "getAnalytics", new NothingDto(), AnalyticsCallbackAssertion);

            await CallExecuteTrade(testCcyPair);

            var pass = await asyncAssertion.Task.ToObservable().Timeout(ResponseTimeout, Observable.Return(false)).Take(1);

            Assert.True(pass);
        }

        [Fact]
        public async void ShouldNotUnsubscribeAllOnChannelReturn()
        {
            const string testCcyPair = "XXXXXB";
            var asyncAssertion = new TaskCompletionSource<bool>();

            // this is the callback when the blotter receives the executed trade notification
            void BlotterCallbackAssertion(dynamic d)
            {
                if (d.IsStateOfTheWorld == "False")
                {
                    foreach (var trade in d.Trades)
                    {
                        if (trade.CurrencyPair == testCcyPair && trade.Status == "Done")
                        {
                            Console.WriteLine(d);
                            // set the assertion
                            asyncAssertion.SetResult(true);
                            return;
                        }
                    }
                }
            }

            await _broker.RpcCall<dynamic, NothingDto>(ServiceTypes.Blotter, "getTradesStream", new NothingDto(), BlotterCallbackAssertion);

            var secondQueue = await _broker.RpcCall<dynamic, NothingDto>(ServiceTypes.Blotter, "getTradesStream", new NothingDto(), BlotterCallbackAssertion);
            _broker.DeleteQueue(secondQueue);

            await CallExecuteTrade(testCcyPair);
            var pass = await asyncAssertion.Task.ToObservable().Timeout(ResponseTimeout, Observable.Return(false)).Take(3);

            Assert.True(pass);
        }

        private async Task CallExecuteTrade(string testCcyPair)
        {
            await _broker.RpcCall<ExecuteTradeRequestDto, dynamic>(ServiceTypes.Execution, "executeTrade",  new ExecuteTradeRequestDto
                        {
                            CurrencyPair = testCcyPair,
                            DealtCurrency = "XXX",
                            Direction = DirectionDto.Buy,
                            Notional = 1000000,
                            SpotRate = 1m,
                            ValueDate = DateUtils.ToSerializationFormat(DateTime.UtcNow.AddDays(2))
                        },
                        (x) => { });
        }
    }
}

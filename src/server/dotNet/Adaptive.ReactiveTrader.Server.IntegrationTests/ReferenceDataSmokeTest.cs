using System;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Xunit;
using Xunit.Abstractions;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ReferenceDataSmokeTest
    {
        private readonly ITestOutputHelper _testOutputHelper;
        private static readonly TimeSpan ResponseTimeout = TimeSpan.FromSeconds(10);

        public ReferenceDataSmokeTest(ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
        }

        [Fact]
        public async void ShouldContainSomeReferenceData()
        {
            var pass = false;
            var timeoutCancellationTokenSource = new CancellationTokenSource();

            var broker = new TestBroker();

            broker.RpcCall<CurrencyPairUpdatesDto, NothingDto>("reference.getCurrencyPairUpdatesStream", new NothingDto(), dto =>
            {
                foreach (var x in dto.Updates)
                {
                    Console.WriteLine(x);
                }

                pass = true;
                timeoutCancellationTokenSource.Cancel(false);
            });

            try
            {
                await Task.Delay(ResponseTimeout, timeoutCancellationTokenSource.Token);
                _testOutputHelper.WriteLine($"Test timed out after {ResponseTimeout.TotalSeconds} seconds");
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(pass);
        }
    }

    public class CurrencyPairUpdatesDto
    {
        public CurrencyPairUpdateDto[] Updates { get; set; }
        public bool IsStateOfTheWorld { get; set; }
        public bool IsStale { get; set; }
    }
}

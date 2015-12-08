using System;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class PopulatedEventstoreSmokeTests
    {
        [Fact]
        public async void CcyPairActivatedEventShouldExist()
        {
            var testPassed = false;

            var es = new ExternalEventStore(new Uri(TestUrls.EventstoreUrl));

            await es.Connection.ConnectAsync();

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            es.Connection.SubscribeToAllFrom(Position.Start, false, (_, e) =>
            {
                if (e.Event.EventType == CurrencyPairActivatedEvent.Type)
                {
                    testPassed = true;
                    timeoutCancellationTokenSource.Cancel(false);
                }
            });

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(5), timeoutCancellationTokenSource.Token);
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(testPassed);
        }
    }
}
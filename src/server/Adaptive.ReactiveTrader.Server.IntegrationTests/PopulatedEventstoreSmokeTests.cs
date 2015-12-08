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
//        [Fact]
        public async void CcyPairEventShouldExist()
        {
            Console.WriteLine("CcyPairEventShouldExist test started");

            var testPassed = false;

            var es = new ExternalEventStore(new Uri(TestUrls.EventstoreUrl));

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            es.Connection.SubscribeToAllFrom(Position.Start, false, (_, e) =>
            {
                if (e.Event.EventType == CurrencyPairCreatedEvent.Type)
                {
                    Console.WriteLine("event seen");
                    testPassed = true;
                    timeoutCancellationTokenSource.Cancel(false);
                }
            });

            await es.Connection.ConnectAsync();

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(10), timeoutCancellationTokenSource.Token);
            }
            catch (TaskCanceledException)
            {
                Console.WriteLine("delay cancelled");
            }

            Assert.True(testPassed);
        }
    }
}
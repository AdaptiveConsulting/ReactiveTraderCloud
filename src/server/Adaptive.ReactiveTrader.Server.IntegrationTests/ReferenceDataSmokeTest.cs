using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.PubSub;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ReferenceDataSmokeTest
    {
        private TestBroker _broker;

        public ReferenceDataSmokeTest()
        {
            _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldContainSomeReferenceData()
        {
            var pass = false;

            Console.WriteLine("Starting ShouldContainSomeReferenceData test");

            var channel = await _broker.OpenChannel();

            Console.WriteLine("Opened channel to broker");

            var refHeartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(heartbeat => heartbeat.Type == "reference")
                .Take(1)
                .ToTask();

            Console.WriteLine("Got reference svc heartbeat, instance: " + refHeartbeat.Instance);
            Console.WriteLine("Calling get reference data");

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            Action callback = () =>
            {
                pass = true;
                Console.WriteLine("All OK, cancelling timeout");
                timeoutCancellationTokenSource.Cancel(false);
            };

            dynamic dto = new
            {
                ReplyTo = "refSmokeTest",
                Payload = new NothingDto()
            };
            
            try
            {
                await channel.RealmProxy.TopicContainer.GetTopicByUri("refSmokeTest").Subscribe(new WampSubscriber(), options: new SubscribeOptions());

                channel.RealmProxy.RpcCatalog.Invoke(new RpcCallback(callback), new CallOptions(),
                    $"{refHeartbeat.Instance}.getCurrencyPairUpdatesStream", new[]
                    {
                        dto
                    });

                await Task.Delay(TimeSpan.FromSeconds(10), timeoutCancellationTokenSource.Token);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            Assert.True(pass);
        }
    }

    public class WampSubscriber : IWampRawTopicClientSubscriber
    {
        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details)
        {
            throw new NotImplementedException();
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments)
        {
            throw new NotImplementedException();
        }

        public void Event<TMessage>(IWampFormatter<TMessage> formatter, long publicationId, EventDetails details, TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            throw new NotImplementedException();
        }
    }
}
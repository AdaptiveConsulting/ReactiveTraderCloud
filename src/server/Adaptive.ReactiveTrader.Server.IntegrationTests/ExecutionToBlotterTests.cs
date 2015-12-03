using System;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Common;
using WampSharp.V2.Core.Contracts;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecutionToBlotterTests
    {
        private readonly ExternalEventStore _eventStore;
        private Repository _repo;
        private readonly TestBroker _broker;
        private string _executionInstanceId;
        private const string Execution = "execution";

        public ExecutionToBlotterTests()
        {
            var eventStoreUriBuilder = new UriBuilder
            {
                Scheme = "tcp",
                UserName = "admin",
                Password = "changeit",
                Host = "192.168.99.100",
                Port = 1113
            };

            _eventStore = new ExternalEventStore(eventStoreUriBuilder.Uri);
            _repo = new Repository(_eventStore.Connection);
            _broker = new TestBroker();
        }

        [Fact(Skip = "execution service needs message dto?")]
        public async void ShouldReceiveBlotterTradeOnTradeExecution()
        {
            var executed = false;

            Console.WriteLine("Starting test");

            var channel = await _broker.OpenChannel();

            Console.WriteLine("Opened channel to broker");

            var executionHeartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(heartbeat => heartbeat.Type == Execution)
                .Take(1)
                .ToTask();

            Console.WriteLine("Got execution svc heartbeat, instance: " + executionHeartbeat.Instance);

            await _eventStore.Connection.ConnectAsync();

            Console.WriteLine("Calling execute trade");

            var timeoutCancellationTokenSource = new CancellationTokenSource();

            Action callback = () =>
            {
                executed = true;
                Console.WriteLine("Execute OK, cancelling timeout");
                timeoutCancellationTokenSource.Cancel(false);
            };

            channel.RealmProxy.RpcCatalog.Invoke(new RpcCallback(callback), new CallOptions(),
                $"{executionHeartbeat.Instance}.executeTrade", new[]
                {
                    new ExecuteTradeRequestDto
                    {
                        CurrencyPair = "EURUSD",
                        DealtCurrency = "EUR",
                        Direction = DirectionDto.Buy,
                        Notional = 1000000,
                        SpotRate = 1.3m,
                        ValueDate = DateUtils.ToSerializationFormat(DateTime.UtcNow.AddDays(2))
                    }
                });

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(2), timeoutCancellationTokenSource.Token);
            }
            catch (TaskCanceledException)
            {
            }

            Assert.True(executed);
        }
    }
}
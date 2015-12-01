using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.Common;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Rpc;
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
            _eventStore = new ExternalEventStore();
            _repo = new Repository(_eventStore.Connection);
            _broker = new TestBroker();
        }

        [Fact]
        public async void ShouldReceiveBlotterTradeOnTradeExecution()
        {
            var channel = await _broker.OpenChannel();

            var executionHeartbeat = await channel.RealmProxy.Services.GetSubject<dynamic>("status")
                .Where(heartbeat => heartbeat.Type == Execution)
                .Take(1).ToTask();

            await _eventStore.Connection.ConnectAsync();

            channel.RealmProxy.RpcCatalog.Invoke(new ExecuteTradeCallback(), new CallOptions(),
                $"{executionHeartbeat.Instance}.executeTrade", new []
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

            await Task.Delay(TimeSpan.FromSeconds(10));
        }
    }

    public class ExecuteTradeCallback : IWampRawRpcOperationClientCallback
    {
        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details)
        {
            Console.WriteLine("response 1");
            throw new NotImplementedException();
        }

        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details, TMessage[] arguments)
        {
            Console.WriteLine("response 2");
            throw new NotImplementedException();
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error)
        {
            Console.WriteLine("response 3");
            throw new NotImplementedException();
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error, TMessage[] arguments)
        {
            Console.WriteLine("response 4");
            Console.WriteLine(error);
        }

        public void Error<TMessage>(IWampFormatter<TMessage> formatter, TMessage details, string error, TMessage[] arguments,
            TMessage argumentsKeywords)
        {
            Console.WriteLine("response 5");
            throw new NotImplementedException();
        }

        public void Result<TMessage>(IWampFormatter<TMessage> formatter, ResultDetails details, TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            Console.WriteLine("response 6");
            throw new NotImplementedException();
        }
    }
}
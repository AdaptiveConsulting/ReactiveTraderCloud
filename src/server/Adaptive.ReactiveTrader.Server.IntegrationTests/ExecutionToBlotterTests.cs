using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Server.Common;
using WampSharp.V2.Rpc;
using Xunit;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class ExecutionToBlotterTests
    {
        private ExternalEventStore _eventStore;
        private Repository _repo;
        private TestBroker _broker;

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
            await _eventStore.Connection.ConnectAsync();

            var proxy = channel.RealmProxy.Services.GetCalleeProxy<IServiceEndpoints>();

            var response = proxy.ExecuteTrade(new ExecuteTradeRequestDto
            {
                CurrencyPair = "EURUSD",
                DealtCurrency = "EUR",
                Direction = DirectionDto.Buy,
                Notional = 1000000,
                SpotRate = 1.3m,
                ValueDate = DateUtils.ToSerializationFormat(DateTime.UtcNow.AddDays(2))
            });

            Assert.NotNull(response);
        }
    }

    public interface IServiceEndpoints
    {
        [WampProcedure("executeTrade")]
        ExecuteTradeResponseDto ExecuteTrade(ExecuteTradeRequestDto request);
    }
}
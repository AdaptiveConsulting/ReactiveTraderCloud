using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.TradeExecution.Events;
using EventStore.ClientAPI;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionEngine
    {
        private readonly TradeIdProvider _tradeIdProvider;
        private readonly Task _initialized;
        private readonly IEventStoreConnection _connection;

        public TradeExecutionEngine(TradeIdProvider tradeIdProvider)
        {
            _tradeIdProvider = tradeIdProvider;
            _connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
            _initialized = _connection.ConnectAsync();
        }

        public async Task<ExecuteTradeResponseDto> ExecuteAsync(ExecuteTradeRequestDto request, string user)
        {
            await _initialized;

            var id = _tradeIdProvider.GetNextId();
            var tradeDate = DateTime.UtcNow;

            var tradeCreatedEvent = new TradeCreatedEvent(id, request.CurrencyPair, request.SpotRate, tradeDate, request.ValueDate, request.Direction, request.Notional, request.DealtCurrency);
            await _connection.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Created", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeCreatedEvent)), new byte[0]));

            var status = await ExecuteImpl(request);

            switch (status)
            {
                case TradeStatusDto.Done:
                    {
                        var tradeCompletedEvent = new TradeCompletedEvent(id);
                        await _connection.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Completed", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeCompletedEvent)), new byte[0]));
                    }
                    break;
                case TradeStatusDto.Rejected:
                    {
                        var tradeRejectedEvent = new TradeRejectedEvent(id, "Execution engine rejected trade");
                        await _connection.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Rejected", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeRejectedEvent)), new byte[0]));
                    }
                    break;
            }

            return new ExecuteTradeResponseDto
            {
                Trade = new TradeDto
                {
                    CurrencyPair = request.CurrencyPair,
                    Direction = request.Direction,
                    Notional = request.Notional,
                    SpotRate = request.SpotRate,
                    Status = status,
                    TradeDate = tradeDate,
                    ValueDate = request.ValueDate,
                    TradeId = id,
                    TraderName = user,
                    DealtCurrency = request.DealtCurrency
                }
            };
        }

        private async Task<TradeStatusDto> ExecuteImpl(ExecuteTradeRequestDto request)
        {
            switch (request.CurrencyPair)
            {
                case "EURJPY":
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    break;
                case "GBPUSD":
                    await Task.Delay(TimeSpan.FromSeconds(1.5));
                    break;
                default:
                    await Task.Delay(TimeSpan.FromSeconds(.5));
                    break;
            }

            return request.CurrencyPair == "GBPJPY" ? TradeStatusDto.Rejected : TradeStatusDto.Done;
        }
    }
}
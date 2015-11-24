using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.Server.Common;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionEngine
    {
        private readonly IEventStore _eventStore;
        private readonly TradeIdProvider _tradeIdProvider;

        public TradeExecutionEngine(IEventStore eventStore, TradeIdProvider tradeIdProvider)
        {
            _eventStore = eventStore;
            _tradeIdProvider = tradeIdProvider;
        }

        public async Task<ExecuteTradeResponseDto> ExecuteAsync(ExecuteTradeRequestDto request, string user)
        {
            var id = await _tradeIdProvider.GetNextId();
            var tradeDate = DateTime.UtcNow;

            var tradeCreatedEvent = new TradeCreatedEvent(id, user, request.CurrencyPair, request.SpotRate, DateUtils.ToSerializationFormat(tradeDate), DateUtils.ToSerializationFormat(request.ValueDate), request.Direction.ToString(), request.Notional, request.DealtCurrency);
            await _eventStore.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Created", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeCreatedEvent)), new byte[0]));

            var status = await ExecuteImpl(request);

            switch (status)
            {
                case TradeStatusDto.Done:
                    {
                        var tradeCompletedEvent = new TradeCompletedEvent(id);
                        await _eventStore.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Completed", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeCompletedEvent)), new byte[0]));
                    }
                    break;
                case TradeStatusDto.Rejected:
                    {
                        var tradeRejectedEvent = new TradeRejectedEvent(id, "Execution engine rejected trade");
                        await _eventStore.AppendToStreamAsync($"trade-{id}", ExpectedVersion.Any, new EventData(Guid.NewGuid(), "Trade Rejected", false, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(tradeRejectedEvent)), new byte[0]));
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
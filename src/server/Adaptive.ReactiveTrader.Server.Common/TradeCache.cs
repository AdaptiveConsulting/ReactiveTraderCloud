using System;
using System.Collections.Generic;
using System.Linq;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public class TradeCache : EventStoreCache<long, Trade, TradesDto>
    {
        private const string TradeCompletedEvent = "TradeCompletedEvent";
        private const string TradeRejectedEvent = "TradeRejectedEvent";
        private const string TradeCreatedEvent = "TradeCreatedEvent";

        private static readonly ISet<string> TradeEventTypes = new HashSet<string>
        {
            TradeCompletedEvent,
            TradeRejectedEvent,
            TradeCreatedEvent
        };

        public TradeCache(IObservable<IConnected<IEventStoreConnection>> eventStoreConnectionStream) : base(eventStoreConnectionStream, Log.Logger)
        {
        }

        public IObservable<TradesDto> GetTrades()
        {
            return GetOutputStream();
        }

        protected override bool IsMatchingEventType(string eventType)
        {
            return TradeEventTypes.Contains(eventType);
        }

        protected override TradesDto CreateResponseFromStateOfTheWorld(StateOfTheWorldContainer<long, Trade> container)
        {
            return new TradesDto(container.StateOfTheWorld.Values.Select(x => x.ToDto()).ToList(), true, container.IsStale);
        }

        protected override TradesDto MapSingleEventToUpdateDto(IDictionary<long, Trade> currentSotw, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case TradeCreatedEvent:
                    return CreateSingleEventUpdateDto(currentSotw, evt.GetEvent<TradeCreatedEvent>().TradeId, TradeStatusDto.Pending);
                case TradeCompletedEvent:
                    return CreateSingleEventUpdateDto(currentSotw, evt.GetEvent<TradeCompletedEvent>().TradeId, TradeStatusDto.Done);
                case TradeRejectedEvent:
                    return CreateSingleEventUpdateDto(currentSotw, evt.GetEvent<TradeRejectedEvent>().TradeId, TradeStatusDto.Rejected);
                default:
                    throw new ArgumentOutOfRangeException("Unsupported Trade event type");
            }
        }

        protected override bool IsValidUpdate(TradesDto update)
        {
            return update != TradesDto.Empty;
        }

        private static TradesDto CreateSingleEventUpdateDto(IDictionary<long, Trade> currentSotw, long tradeId, TradeStatusDto status)
        {
            var trade = currentSotw[tradeId];
            var dto = trade.ToDto();
            dto.Status = status;
            return new TradesDto(new[] {dto}, false, false);
        }

        protected override void UpdateStateOfTheWorld(IDictionary<long, Trade> currentSotw, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case TradeCreatedEvent:
                    var createdEvent = evt.GetEvent<TradeCreatedEvent>();
                    currentSotw.Add(createdEvent.TradeId,
                                    new Trade(
                                        createdEvent.TradeId,
                                        createdEvent.TraderName,
                                        createdEvent.CurrencyPair,
                                        createdEvent.Notional,
                                        createdEvent.DealtCurrency,
                                        (DirectionDto) Enum.Parse(typeof (DirectionDto), createdEvent.Direction),
                                        createdEvent.SpotRate,
                                        createdEvent.TradeDate,
                                        createdEvent.ValueDate,
                                        TradeStatusDto.Pending));
                    break;
                case TradeCompletedEvent:
                    var activatedEvent = evt.GetEvent<TradeCompletedEvent>();
                    currentSotw[activatedEvent.TradeId].Status = TradeStatusDto.Done;
                    break;
                case TradeRejectedEvent:
                    var deactivatedEvent = evt.GetEvent<TradeRejectedEvent>();
                    currentSotw[deactivatedEvent.TradeId].Status = TradeStatusDto.Rejected;
                    break;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported Trade event type");
            }
        }

        protected override TradesDto GetDisconnectedStaleUpdate()
        {
            return new TradesDto(new TradeDto[0], false, true);
        }
    }
}

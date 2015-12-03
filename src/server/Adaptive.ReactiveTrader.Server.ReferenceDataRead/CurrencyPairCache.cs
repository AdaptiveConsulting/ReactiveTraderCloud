using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPairCache : EventStoreCache<string, CurrencyPair, CurrencyPairUpdatesDto>
    {
        protected static readonly ILog Log = LogManager.GetLogger<CurrencyPairCache>();

        private const string CurrencyPairCreatedEventType = "CurrencyPairCreatedEvent";
        private const string CurrencyPairChangedEventType = "CurrencyPairChangedEvent";
        private const string CurrencyPairActivatedEventType = "CurrencyPairActivatedEvent";
        private const string CurrencyPairDeactivatedEventType = "CurrencyPairDeactivatedEvent";

        private static readonly ISet<string> CurrencyPairEventTypes = new HashSet<string>
        {
            CurrencyPairCreatedEventType,
            CurrencyPairChangedEventType,
            CurrencyPairActivatedEventType,
            CurrencyPairDeactivatedEventType
        };

        public CurrencyPairCache(IObservable<IConnected<IEventStoreConnection>> eventStoreConnectionStream) : base(eventStoreConnectionStream, Log)
        {
        }

        protected override bool IsMatchingEventType(string eventType)
        {
            return CurrencyPairEventTypes.Contains(eventType);
        }

        public IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdates()
        {
            return GetOutputStream();
        }

        protected override CurrencyPairUpdatesDto CreateResponseFromStateOfTheWorld(StateOfTheWorldContainer<string, CurrencyPair> container)
        {
            var enabledCurrencyPairs = container.StateOfTheWorld.Values.Where(x => x.IsEnabled);

            return new CurrencyPairUpdatesDto(enabledCurrencyPairs.Select(x => new CurrencyPairUpdateDto
                                                           {
                                                               CurrencyPair = new CurrencyPairDto(x.Symbol, x.RatePrecision, x.PipsPosition),
                                                               UpdateType = UpdateTypeDto.Added
                                                           })
                                                           .ToList(), true, container.IsStale);
        }

        protected override void UpdateStateOfTheWorld(IDictionary<string, CurrencyPair> currentSotw, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case CurrencyPairCreatedEventType:
                    var createdEvent = evt.GetEvent<CurrencyPairCreatedEvent>();
                    currentSotw.Add(createdEvent.Symbol, new CurrencyPair(createdEvent.Symbol, createdEvent.PipsPosition, createdEvent.RatePrecision, createdEvent.SampleRate, createdEvent.Comment));
                    break;
                case CurrencyPairActivatedEventType:
                    var activatedEvent = evt.GetEvent<CurrencyPairActivatedEvent>();
                    currentSotw[activatedEvent.Symbol].IsEnabled = true;
                    break;
                case CurrencyPairDeactivatedEventType:
                    var deactivatedEvent = evt.GetEvent<CurrencyPairActivatedEvent>();
                    currentSotw[deactivatedEvent.Symbol].IsEnabled = false;
                    break;
                case CurrencyPairChangedEventType:
                    break;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }
        }

        protected override CurrencyPairUpdatesDto MapSingleEventToUpdateDto(IDictionary<string, CurrencyPair> currentSotw, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case CurrencyPairActivatedEventType:
                    return CreateSingleEventUpdateDto(currentSotw, evt.GetEvent<CurrencyPairActivatedEvent>().Symbol, UpdateTypeDto.Added);
                case CurrencyPairDeactivatedEventType:
                    return CreateSingleEventUpdateDto(currentSotw, evt.GetEvent<CurrencyPairDeactivatedEvent>().Symbol, UpdateTypeDto.Removed);
                case CurrencyPairCreatedEventType:
                case CurrencyPairChangedEventType:
                    return CurrencyPairUpdatesDto.Empty;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }
        }

        protected override bool IsValidUpdate(CurrencyPairUpdatesDto update)
        {
            return update != CurrencyPairUpdatesDto.Empty;
        }


        private static CurrencyPairUpdatesDto CreateSingleEventUpdateDto(IDictionary<string, CurrencyPair> currentSow, string symbol, UpdateTypeDto updateType)
        {
            var ccyPairToDeactivate = currentSow[symbol];
            return new CurrencyPairUpdatesDto(new[]
            {
                new CurrencyPairUpdateDto
                {
                    CurrencyPair = new CurrencyPairDto(ccyPairToDeactivate.Symbol, ccyPairToDeactivate.RatePrecision, ccyPairToDeactivate.PipsPosition),
                    UpdateType = updateType
                }
            }, false, false);
        }
    }
}
using System;
using System.Linq;
using System.Collections.Generic;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class TradeCache : IDisposable
    {
        private readonly IEventStoreConnection _eventStoreConnection;
        private bool _isCaughtUp;
        private IConnectableObservable<RecordedEvent> _tradeEvents;

        private const string TradeCompletedEvent = "TradeCompletedEvent";
        private const string TradeRejectedEvent = "TradeRejectedEvent";
        private const string TradeCreatedEvent = "TradeCreatedEvent";

        private static readonly ISet<string> TradeEventTypes = new HashSet<string>
        {
            TradeCompletedEvent,
            TradeRejectedEvent,
            TradeCreatedEvent
        };

        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly Dictionary<long, Trade> _stateOfTheWorld = new Dictionary<long, Trade>();
        private readonly BehaviorSubject<Dictionary<long, Trade>> _stateOfTheWorldUpdates = new BehaviorSubject<Dictionary<long, Trade>>(null);
        private CompositeDisposable Disposables { get; }

        public TradeCache(IEventStoreConnection eventStoreConnection)
        {
            _eventStoreConnection = eventStoreConnection;
            Disposables = new CompositeDisposable();
        }

        public void Initialize()
        {
            _isCaughtUp = false;

            _tradeEvents = GetAllEvents()
                .Where(x => TradeEventTypes.Contains(x.EventType))
                .Select(x => x)
                .SubscribeOn(_eventLoopScheduler)
                .Publish();

            Disposables.Add(_tradeEvents.Subscribe(evt =>
            {
                UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                if (_isCaughtUp)
                {
                    _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                }
            }));

            Disposables.Add(_tradeEvents.Connect());
        }

        public IObservable<TradesDto> GetTrades()
        {
            return GetTradesImpl().SubscribeOn(_eventLoopScheduler);
        }

        private IObservable<TradesDto> GetTradesImpl()
        {
            return Observable.Create<TradesDto>(obs =>
            {
                var sotw = _stateOfTheWorldUpdates
                    .Where(x => x != null)
                    .Take(1)
                    .Select(x => BuildStateOfTheWorldDto(x.Values));

                return sotw.Concat(_tradeEvents.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorld, evt)))
                          .Subscribe(obs);
            });
        }

        private static TradesDto BuildStateOfTheWorldDto(IEnumerable<Trade> trades)
        {
            return new TradesDto(trades.Select(x => x.ToDto()).ToList());
        }

        private static TradesDto MapSingleEventToUpdateDto(IDictionary<long, Trade> currentSotw, RecordedEvent evt)
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

        private static TradesDto CreateSingleEventUpdateDto(IDictionary<long, Trade> currentSotw, long tradeId, TradeStatusDto status)
        {
            var trade = currentSotw[tradeId];
            var dto = trade.ToDto();
            dto.Status = status;
            return new TradesDto(new[] { dto });
        }

        private IObservable<RecordedEvent> GetAllEvents()
        {
            return Observable.Create<RecordedEvent>(o =>
            {
                Action<EventStoreCatchUpSubscription, ResolvedEvent> onEvent = (_, e) =>
                {
                    _eventLoopScheduler.Schedule(() =>
                    {
                        o.OnNext(e.Event);
                    });
                };

                Action<EventStoreCatchUpSubscription> onCaughtUp = evt =>
                {
                    _eventLoopScheduler.Schedule(() =>
                    {
                        _isCaughtUp = true;
                        _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                    });
                };

                var subscription = _eventStoreConnection.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
                return new CompositeDisposable(Disposable.Create(() => subscription.Stop()));
            });
        }

        private static void UpdateStateOfTheWorld(IDictionary<long, Trade> currentSotw, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case TradeCreatedEvent:
                    var createdEvent = evt.GetEvent<TradeCreatedEvent>();
                    currentSotw.Add(createdEvent.TradeId, new Trade(
                        createdEvent.TradeId,
                        createdEvent.UserName,
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

        public void Dispose()
        {
            Disposables.Dispose();
        }
    }
}

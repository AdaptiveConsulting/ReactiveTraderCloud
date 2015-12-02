using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    // TODO add logging
    public class CurrencyPairCache : IDisposable
    {
        private readonly IEventStoreConnection _es;
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

        private readonly Dictionary<string, CurrencyPair> _stateOfTheWorld = new Dictionary<string, CurrencyPair>();
        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly BehaviorSubject<Dictionary<string, CurrencyPair>> _stateOfTheWorldUpdates = new BehaviorSubject<Dictionary<string, CurrencyPair>>(new Dictionary<string, CurrencyPair>());
        private IConnectableObservable<RecordedEvent> _currencyPairEvents;
        private bool _isCaughtUp;

        public CurrencyPairCache(IEventStoreConnection es)
        {
            _es = es;
            Disposables = new CompositeDisposable();
        }

        private CompositeDisposable Disposables { get; }

        public void Initialize()
        {
            _isCaughtUp = false;

            _currencyPairEvents = GetAllEvents().Where(x => CurrencyPairEventTypes.Contains(x.EventType))
                                                .Select(x => x)
                                                .SubscribeOn(_eventLoopScheduler)
                                                .Publish();

            Disposables.Add(_currencyPairEvents.Subscribe(evt =>
            {
                UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                if (_isCaughtUp)
                {
                    _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                }
            }));

            Disposables.Add(_currencyPairEvents.Connect());
        }

        public IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdates()
        {
            return GetCurrencyPairUpdatesImpl().SubscribeOn(_eventLoopScheduler);
        }

        private IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdatesImpl()
        {
            return Observable.Create<CurrencyPairUpdatesDto>(obs =>
            {
                var sow = _stateOfTheWorldUpdates.Take(1)
                                                 .Select(x => BuildStateOfTheWorldDto(x.Values.Where(cp => cp.IsEnabled)));

                return sow.Concat(_currencyPairEvents.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorld, evt)))
                          .Where(x => x != CurrencyPairUpdatesDto.Empty)
                          .Subscribe(obs);
            });
        }

        private static CurrencyPairUpdatesDto BuildStateOfTheWorldDto(IEnumerable<CurrencyPair> currencyPairs)
        {
            return new CurrencyPairUpdatesDto(currencyPairs.Where(x => x.IsEnabled)
                                                           .Select(x => new CurrencyPairUpdateDto
                                                           {
                                                               CurrencyPair = new CurrencyPairDto(x.Symbol, x.RatePrecision, x.PipsPosition),
                                                               UpdateType = UpdateTypeDto.Added
                                                           })
                                                           .ToList(), true);
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

                var subscription = _es.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
                return new CompositeDisposable(Disposable.Create(() => subscription.Stop()));
            });
        }

        private void UpdateStateOfTheWorld(IDictionary<string, CurrencyPair> currentSow, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case CurrencyPairCreatedEventType:
                    var createdEvent = evt.GetEvent<CurrencyPairCreatedEvent>();
                    currentSow.Add(createdEvent.Symbol, new CurrencyPair(createdEvent.Symbol, createdEvent.PipsPosition, createdEvent.RatePrecision, createdEvent.SampleRate, createdEvent.Comment));
                    break;
                case CurrencyPairActivatedEventType:
                    var activatedEvent = evt.GetEvent<CurrencyPairActivatedEvent>();
                    currentSow[activatedEvent.Symbol].IsEnabled = true;
                    break;
                case CurrencyPairDeactivatedEventType:
                    var deactivatedEvent = evt.GetEvent<CurrencyPairActivatedEvent>();
                    currentSow[deactivatedEvent.Symbol].IsEnabled = false;
                    break;
                case CurrencyPairChangedEventType:
                    break;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }
        }

        private CurrencyPairUpdatesDto MapSingleEventToUpdateDto(IDictionary<string, CurrencyPair> currentSow, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case CurrencyPairActivatedEventType:
                    return CreateSingleEventUpdateDto(currentSow, evt.GetEvent<CurrencyPairActivatedEvent>().Symbol, UpdateTypeDto.Added);
                case CurrencyPairDeactivatedEventType:
                    return CreateSingleEventUpdateDto(currentSow, evt.GetEvent<CurrencyPairDeactivatedEvent>().Symbol, UpdateTypeDto.Removed);
                case CurrencyPairCreatedEventType:
                case CurrencyPairChangedEventType:
                    return CurrencyPairUpdatesDto.Empty;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }
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
            }, false);
        }
                
        public void Dispose()
        {
            Disposables.Dispose();
        }
    }
}
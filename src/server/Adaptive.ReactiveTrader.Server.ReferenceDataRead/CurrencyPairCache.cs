using Adaptive.ReactiveTrader.Server.ReferenceData;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead.Events;
using EventStore.ClientAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPairCache : IDisposable
    {
        private const string EventStoreUri = "tcp://admin:changeit@127.0.0.1:1113";
        private const string CurrencyPairCreatedEventType = "Currency Pair Created";
        private const string CurrencyPairChangedEventType = "Currency Pair Changed";
        private const string CurrencyPairActivatedEventType = "Currency Pair Activated";
        private const string CurrencyPairDeactivatedEventType = "Currency Pair Deactivated";

        private static readonly ISet<string> CurrencyPairEventTypes = new HashSet<string>
        {
            CurrencyPairCreatedEventType,
            CurrencyPairChangedEventType,
            CurrencyPairActivatedEventType,
            CurrencyPairDeactivatedEventType
        };

        private readonly Dictionary<string, CurrencyPair> _stateOfTheWorld = new Dictionary<string, CurrencyPair>();
        private readonly EventLoopScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly BehaviorSubject<Dictionary<string, CurrencyPair>> _stateOfTheWorldUpdates = new BehaviorSubject<Dictionary<string, CurrencyPair>>(null);
        private IConnectableObservable<RecordedEvent> _currencyPairEvents;
        private bool _isCaughtUp;

        public CurrencyPairCache()
        {
            Disposables = new CompositeDisposable();
        }

        private CompositeDisposable Disposables { get; }

        public void Initialize()
        {
            _isCaughtUp = false;

            _currencyPairEvents = GetAllCurrencyPairEvents().Publish();
            Disposables.Add(_currencyPairEvents.Connect());

            Disposables.Add(_currencyPairEvents.SubscribeOn(_eventLoopScheduler)
                                               .Subscribe(evt =>
                                               {
                                                   UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                                                   if (_isCaughtUp)
                                                   {
                                                       _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                                                   }
                                               }));
        }

        private IObservable<RecordedEvent> GetAllCurrencyPairEvents()
        {
            return GetAllEvents(EventStoreUri).Where(x => CurrencyPairEventTypes.Contains(x.Event.EventType))
                                              .Select(x => x.Event);
        }

        public IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdates()
        {
            return GetCurrencyPairUpdatesImpl().SubscribeOn(_eventLoopScheduler);
        }

        private IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdatesImpl()
        {
            return Observable.Create<CurrencyPairUpdatesDto>(obs =>
            {
                var sow = _stateOfTheWorldUpdates.Where(x => x != null)
                                                 .Take(1)
                                                 .Select(x => BuildUpdateDto(x.Values.Where(cp => cp.IsEnabled)));

                return sow.Concat(_currencyPairEvents.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorld, evt)))
                          .Subscribe(obs);
            });
        }

        private static CurrencyPairUpdatesDto BuildUpdateDto(IEnumerable<CurrencyPair> currencyPairs)
        {
            return new CurrencyPairUpdatesDto(currencyPairs.Where(x => x.IsEnabled)
                                                           .Select(x => new CurrencyPairUpdateDto
                                                           {
                                                               CurrencyPair = new CurrencyPairDto(x.Symbol, x.RatePrecision, x.PipsPosition),
                                                               UpdateType = UpdateTypeDto.Added
                                                           })
                                                           .ToList());
        }

        private IObservable<ResolvedEvent> GetAllEvents(string eventStoreUri)
        {
            return Observable.Create<ResolvedEvent>(async o =>
            {
                var conn = await ConnectToEventStore(eventStoreUri);

                Action<EventStoreCatchUpSubscription, ResolvedEvent> onEvent = (_, resolvedEvent) =>
                {
                    _eventLoopScheduler.Schedule(() =>
                    {
                        o.OnNext(resolvedEvent);
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

                var subscription = conn.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
                return new CompositeDisposable(Disposable.Create(() => subscription.Stop()), conn);
            });
        }

        private void UpdateStateOfTheWorld(IDictionary<string, CurrencyPair> currencyPairs, RecordedEvent evt)
        {
            switch (evt.EventType)
            {
                case CurrencyPairCreatedEventType:
                    var createdEvent = GetEvent<CurrencyPairCreatedEvent>(evt);
                    currencyPairs.Add(createdEvent.Symbol, new CurrencyPair(createdEvent.Symbol, createdEvent.PipsPosition, createdEvent.RatePrecision, createdEvent.SampleRate, createdEvent.Comment));
                    break;
                case CurrencyPairActivatedEventType:
                    var activatedEvent = GetEvent<CurrencyPairActivatedEvent>(evt);
                    currencyPairs[activatedEvent.Symbol].IsEnabled = true;
                    break;
                case CurrencyPairDeactivatedEventType:
                    var deactivatedEvent = GetEvent<CurrencyPairActivatedEvent>(evt);
                    currencyPairs[deactivatedEvent.Symbol].IsEnabled = false;
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
                    var activatedEvent = GetEvent<CurrencyPairActivatedEvent>(evt);
                    var ccyPairToActivate = currentSow[activatedEvent.Symbol];
                    return new CurrencyPairUpdatesDto(new[]
                    {
                        new CurrencyPairUpdateDto
                        {
                            CurrencyPair =new CurrencyPairDto(ccyPairToActivate.Symbol, ccyPairToActivate.RatePrecision, ccyPairToActivate.PipsPosition),
                            UpdateType = UpdateTypeDto.Added
                        }
                    });
                    case CurrencyPairDeactivatedEventType:
                    var deactivatedEvent = GetEvent<CurrencyPairDeactivatedEvent>(evt);
                    var ccyPairToDeactivate = currentSow[deactivatedEvent.Symbol];
                    return new CurrencyPairUpdatesDto(new[]
                    {
                        new CurrencyPairUpdateDto
                        {
                            CurrencyPair =new CurrencyPairDto(ccyPairToDeactivate.Symbol, ccyPairToDeactivate.RatePrecision, ccyPairToDeactivate.PipsPosition),
                            UpdateType = UpdateTypeDto.Removed
                        }
                    });
                case CurrencyPairCreatedEventType:
                case CurrencyPairChangedEventType:
                    return CurrencyPairUpdatesDto.Empty;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }
        }

        private T GetEvent<T>(RecordedEvent evt)
        {
            var eventString = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject<T>(eventString);
        }

        private async Task<IEventStoreConnection> ConnectToEventStore(string uriString)
        {
            var connectionSettings = ConnectionSettings.Create().KeepReconnecting();

            var uri = new Uri(uriString);
            var conn = EventStoreConnection.Create(connectionSettings, uri);
            await conn.ConnectAsync();
            return conn;
        }

        public void Dispose()
        {
            Disposables.Dispose();
        }
    }
}
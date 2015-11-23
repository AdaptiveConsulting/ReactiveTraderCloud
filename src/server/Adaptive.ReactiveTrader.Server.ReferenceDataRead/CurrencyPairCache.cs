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
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPairCache : IDisposable
    {
        private readonly IEventStore _es;
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
        private IConnectableObservable<IEvent> _currencyPairEvents;
        private bool _isCaughtUp;

        public CurrencyPairCache(IEventStore es)
        {
            _es = es;
            Disposables = new CompositeDisposable();
        }

        private CompositeDisposable Disposables { get; }

        public void Initialize()
        {
            _isCaughtUp = false;

            _currencyPairEvents = GetAllCurrencyPairEvents().Publish();
            

            Disposables.Add(_currencyPairEvents.SubscribeOn(_eventLoopScheduler)
                                               .Subscribe(evt =>
                                               {
                                                   UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                                                   if (_isCaughtUp)
                                                   {
                                                       _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                                                   }
                                               }));

            Disposables.Add(_currencyPairEvents.Connect());
        }

        private IObservable<IEvent> GetAllCurrencyPairEvents()
        {
            return GetAllEvents().Where(x => CurrencyPairEventTypes.Contains(x.EventType));

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

        private IObservable<IEvent> GetAllEvents()
        {
            return Observable.Create<IEvent>(o =>
            {
                Action<IEvent> onEvent = (e) =>
                {
                    _eventLoopScheduler.Schedule(() =>
                    {
                        o.OnNext(e);
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

        private void UpdateStateOfTheWorld(IDictionary<string, CurrencyPair> currencyPairs, IEvent evt)
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

        private CurrencyPairUpdatesDto MapSingleEventToUpdateDto(IDictionary<string, CurrencyPair> currentSow, IEvent evt)
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

        private T GetEvent<T>(IEvent evt)
        {
            var eventString = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject<T>(eventString);
        }

        public void Dispose()
        {
            Disposables.Dispose();
        }
    }
}
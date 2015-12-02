using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore;
using Common.Logging;
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

        private readonly Dictionary<string, CurrencyPair> _stateOfTheWorld = new Dictionary<string, CurrencyPair>();
        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly BehaviorSubject<Dictionary<string, CurrencyPair>> _stateOfTheWorldUpdates = new BehaviorSubject<Dictionary<string, CurrencyPair>>(null);
        private IConnectableObservable<RecordedEvent> _currencyPairEvents;
        private bool _isCaughtUp;

        private readonly SerialDisposable _currencyPairsSubscription = new SerialDisposable();
        private readonly SerialDisposable _currencyPairsConnection = new SerialDisposable();
        private readonly IConnectableObservable<IConnected<IEventStoreConnection>> _reconnected;

        public CurrencyPairCache(IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            Disposables = new CompositeDisposable();

            _reconnected = eventStoreStream.ObserveOn(_eventLoopScheduler)
                               .Where(c => c.IsConnected)
                               .Do(_ => Log.Info("Reconnected Fired"))
                               .Publish();

            _reconnected.Connect();

            Disposables.Add(eventStoreStream
                              .ObserveOn(_eventLoopScheduler)
                              .Where(x => x.IsConnected)
                              .Subscribe(x => Initialize(x.Value)));

            Disposables.Add(eventStoreStream
                                .ObserveOn(_eventLoopScheduler)
                                .Subscribe(x => Log.Info($"IsConnected {x.IsConnected}")));
        }

        private CompositeDisposable Disposables { get; }

        private void Initialize(IEventStoreConnection connection)
        {
            if (Log.IsInfoEnabled)
            {
                Log.Info("Initializing Cache");
            }

            _stateOfTheWorld.Clear();
            _isCaughtUp = false;

            _currencyPairEvents = GetAllEvents(connection).Where(x => CurrencyPairEventTypes.Contains(x.EventType))
                                                .Select(x => x)
                                                .SubscribeOn(_eventLoopScheduler)
                                                .Publish();

            _currencyPairsSubscription.Disposable = _currencyPairEvents.Subscribe(evt =>
            {
                UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                if (_isCaughtUp)
                {
                    _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                }
            });

            _currencyPairsConnection.Disposable = _currencyPairEvents.Connect();
        }

        public IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdates()
        {
            return GetCurrencyPairUpdatesImpl().SubscribeOn(_eventLoopScheduler)
                                               .TakeUntil(_reconnected)
                                               .Repeat();
        }

        private IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdatesImpl()
        {
            return Observable.Create<CurrencyPairUpdatesDto>(obs =>
            {
                if (Log.IsInfoEnabled)
                {
                    Log.Info("Creating observable for CurrencyPairUpdates");
                }

                var sow = _stateOfTheWorldUpdates.Where(x => x != null)
                                                 .Take(1)
                                                 .Select(x => BuildStateOfTheWorldDto(x.Values.Where(cp => cp.IsEnabled)))
                                                 .Do(_ =>
                                                 {
                                                     if (Log.IsInfoEnabled)
                                                     {
                                                         Log.Info("Publishing State Of The World update");
                                                     }
                                                 });

                return sow.Concat(_currencyPairEvents.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorld, evt)).
                                                      Do(_ =>
                                                      {
                                                          if (Log.IsInfoEnabled)
                                                          {
                                                              Log.Info("Publishing update");
                                                          }
                                                      }))
                          .Where(x => x != CurrencyPairUpdatesDto.Empty)
                          .Subscribe(obs.OnNext,
                                     ex =>
                                     {
                                         Log.Info(@"Stream Errored: {ex}");
                                         obs.OnError(ex);
                                     },
                                     () =>
                                     {
                                         Log.Info("Stream Completed");
                                         obs.OnCompleted();
                                     });
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

        private IObservable<RecordedEvent> GetAllEvents(IEventStoreConnection connection)
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

                var subscription = connection.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
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
            _currencyPairsSubscription.Dispose();
            _currencyPairsConnection.Dispose();
            Disposables.Dispose();
        }
    }
}
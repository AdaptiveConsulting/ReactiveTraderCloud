using System;
using System.Collections.Generic;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Common;
using EventStore.ClientAPI;
using Serilog.Events;
using ILogger = Serilog.ILogger;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class StateOfTheWorldContainer<TKey, TCacheItem>
    {
        public StateOfTheWorldContainer()
        {
            StateOfTheWorld = new Dictionary<TKey, TCacheItem>();
            IsStale = true;
        }

        public bool IsStale { get; set; }

        public Dictionary<TKey, TCacheItem> StateOfTheWorld { get; }
    }

    public abstract class EventStoreCache<TKey, TCacheItem, TOutput> : IDisposable
    {
        private readonly IConnectableObservable<IConnected<IEventStoreConnection>> _connectionChanged;
        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly SerialDisposable _eventsConnection = new SerialDisposable();
        private readonly SerialDisposable _eventsSubscription = new SerialDisposable();

        private readonly StateOfTheWorldContainer<TKey, TCacheItem> _stateOfTheWorldContainer = new StateOfTheWorldContainer<TKey, TCacheItem>();

        private readonly BehaviorSubject<StateOfTheWorldContainer<TKey, TCacheItem>> _stateOfTheWorldUpdates =
            new BehaviorSubject<StateOfTheWorldContainer<TKey, TCacheItem>>(new StateOfTheWorldContainer<TKey, TCacheItem>());

        private readonly ILogger _log;
        private IConnectableObservable<RecordedEvent> _events = Observable.Never<RecordedEvent>().Publish();
        private bool _isCaughtUp;

        protected EventStoreCache(IObservable<IConnected<IEventStoreConnection>> eventStoreConnectionStream, ILogger log)
        {
            _log = log;
            Disposables = new CompositeDisposable(_eventsConnection, _eventsSubscription);

            _connectionChanged = eventStoreConnectionStream.ObserveOn(_eventLoopScheduler)
                                                           .Publish();

            Disposables.Add(_connectionChanged.Connect());

            Disposables.Add(_connectionChanged.Subscribe(x =>
            {
                if (x.IsConnected)
                {
                    if (_log.IsEnabled(LogEventLevel.Information))
                    {
                        _log.Information("Connected to Event Store");
                    }

                    Initialize(x.Value);
                }
                else
                {
                    if (_log.IsEnabled(LogEventLevel.Information))
                    {
                        _log.Information("Disconnected from Event Store");
                    }

                    if (!_stateOfTheWorldContainer.IsStale)
                    {
                        _stateOfTheWorldContainer.IsStale = true;
                        _stateOfTheWorldUpdates.OnNext(_stateOfTheWorldContainer);
                    }
                }
            }));
        }

        private CompositeDisposable Disposables { get; }

        public virtual void Dispose()
        {
            Disposables.Dispose();
        }

        protected abstract bool IsMatchingEventType(string eventType);
        protected abstract void UpdateStateOfTheWorld(IDictionary<TKey, TCacheItem> currentStateOfTheWorld, RecordedEvent evt);
        protected abstract bool IsValidUpdate(TOutput update);
        protected abstract TOutput CreateResponseFromStateOfTheWorld(StateOfTheWorldContainer<TKey, TCacheItem> container);
        protected abstract TOutput MapSingleEventToUpdateDto(IDictionary<TKey, TCacheItem> currentStateOfTheWorld, RecordedEvent evt);
        protected abstract TOutput GetDisconnectedStaleUpdate();

        protected IObservable<TOutput> GetOutputStream()
        {
            return GetOutputStreamImpl().SubscribeOn(_eventLoopScheduler)
                                        .TakeUntil(_connectionChanged.Where(x => x.IsConnected))
                                        .Repeat();
        }

        private void Initialize(IEventStoreConnection connection)
        {
            if (_log.IsEnabled(LogEventLevel.Information))
            {
                _log.Information("Initializing Cache");
            }

            _stateOfTheWorldContainer.IsStale = true;
            _stateOfTheWorldContainer.StateOfTheWorld.Clear();
            _isCaughtUp = false;

            _events = GetAllEvents(connection).Where(x => IsMatchingEventType(x.EventType))
                                              .SubscribeOn(_eventLoopScheduler)
                                              .Publish();

            _eventsSubscription.Disposable = _events.Subscribe(evt =>
            {
                UpdateStateOfTheWorld(_stateOfTheWorldContainer.StateOfTheWorld, evt);

                if (_isCaughtUp)
                {
                    _stateOfTheWorldUpdates.OnNext(_stateOfTheWorldContainer);
                }
            });
            _eventsConnection.Disposable = _events.Connect();
        }

        private IObservable<TOutput> GetOutputStreamImpl()
        {
            return Observable.Create<TOutput>(obs =>
            {
                if (_log.IsEnabled(LogEventLevel.Information))
                {
                    _log.Information("Got stream request from client");
                }

                var sotw = _stateOfTheWorldUpdates.TakeUntilInclusive(x => !x.IsStale)
                                                  .Select(CreateResponseFromStateOfTheWorld);

                return sotw.Concat(_events.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorldContainer.StateOfTheWorld, evt)))
                           .Merge(_connectionChanged.Where(x => !x.IsConnected).Select(_ => GetDisconnectedStaleUpdate()))
                           .Where(IsValidUpdate)
                           .Subscribe(obs);
            });
        }

        private IObservable<RecordedEvent> GetAllEvents(IEventStoreConnection connection)
        {
            return Observable.Create<RecordedEvent>(o =>
            {
                if (_log.IsEnabled(LogEventLevel.Information))
                {
                    _log.Information("Getting events from Event Store");
                }

                Action<EventStoreCatchUpSubscription, ResolvedEvent> onEvent =
                    (_, e) => { _eventLoopScheduler.Schedule(() => { o.OnNext(e.Event); }); };

                Action<EventStoreCatchUpSubscription> onCaughtUp = evt =>
                {
                    _eventLoopScheduler.Schedule(() =>
                    {
                        if (_log.IsEnabled(LogEventLevel.Information))
                        {
                            _log.Information("Caught up to live events. Publishing State of The World");
                        }

                        _isCaughtUp = true;
                        _stateOfTheWorldContainer.IsStale = false;
                        _stateOfTheWorldUpdates.OnNext(_stateOfTheWorldContainer);
                    });
                };

                var subscription = connection.SubscribeToAllFrom(Position.Start, false, onEvent, onCaughtUp);
                var guid = Guid.Empty;

                if (_log.IsEnabled(LogEventLevel.Information))
                {
                    guid = Guid.NewGuid();
                    _log.Information("Subscribed to Event Store. Subscription ID {subscriptionId}", guid);
                }

                return Disposable.Create(() =>
                {
                    if (_log.IsEnabled(LogEventLevel.Information))
                    {
                        _log.Information("Stopping Event Store subscription {subscriptionId}", guid);
                    }

                    subscription.Stop();
                });
            });
        }
    }
}
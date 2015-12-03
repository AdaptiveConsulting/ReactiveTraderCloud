using Adaptive.ReactiveTrader.Common;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Collections.Generic;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.EventStore
{
    public abstract class EventStoreCache<TKey, TCacheItem, TOutput> : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<EventStoreCache<TKey, TCacheItem, TOutput>>();

        private readonly Dictionary<TKey, TCacheItem> _stateOfTheWorld = new Dictionary<TKey, TCacheItem>();
        private readonly IScheduler _eventLoopScheduler = new EventLoopScheduler();
        private readonly BehaviorSubject<Dictionary<TKey, TCacheItem>> _stateOfTheWorldUpdates = new BehaviorSubject<Dictionary<TKey, TCacheItem>>(null);
        private readonly IConnectableObservable<IConnected<IEventStoreConnection>> _connected;
        private IConnectableObservable<RecordedEvent> _events;
        private bool _isCaughtUp;

        private readonly SerialDisposable _eventsSubscription = new SerialDisposable();
        private readonly SerialDisposable _eventsConnection = new SerialDisposable();

        protected EventStoreCache(IObservable<IConnected<IEventStoreConnection>> eventStoreConnectionStream)
        {
            Disposables = new CompositeDisposable();

            _connected = eventStoreConnectionStream.ObserveOn(_eventLoopScheduler)
                               .Where(c => c.IsConnected)
                               .Do(_ => Log.Info("Reconnected Fired"))
                               .Publish();

            Disposables.Add(_connected.Connect());

            Disposables.Add(eventStoreConnectionStream
                  .ObserveOn(_eventLoopScheduler)
                  .Where(x => x.IsConnected)
                  .Subscribe(x => Initialize(x.Value)));

            Disposables.Add(eventStoreConnectionStream
                                .ObserveOn(_eventLoopScheduler)
                                .Subscribe(x => Log.Info($"IsConnected {x.IsConnected}")));
        }

        private CompositeDisposable Disposables { get; }

        protected abstract bool IsMatchingEventType(string eventType);
        protected abstract void UpdateStateOfTheWorld(IDictionary<TKey, TCacheItem> currentStateOfTheWorld, RecordedEvent evt);
        protected abstract bool IsValidUpdate(TOutput update);
        protected abstract TOutput BuildStateOfTheWorldDto(IEnumerable<TCacheItem> items);
        protected abstract TOutput MapSingleEventToUpdateDto(IDictionary<TKey, TCacheItem> currentStateOfTheWorld, RecordedEvent evt);

        protected IObservable<TOutput> GetOutputStream()
        {
            return GetOutputStreamImpl().SubscribeOn(_eventLoopScheduler)
                                        .SkipUntil(_connected.Take(1))
                                        .TakeUntil(_connected.Skip(1))
                                        .Repeat();
        }

        private void Initialize(IEventStoreConnection connection)
        {
            _stateOfTheWorld.Clear();
            _isCaughtUp = false;

            _events = GetAllEvents(connection).Where(x => IsMatchingEventType(x.EventType))
                                              .SubscribeOn(_eventLoopScheduler)
                                              .Publish();

            _eventsSubscription.Disposable = _events.Subscribe(evt =>
            {
                UpdateStateOfTheWorld(_stateOfTheWorld, evt);

                if (_isCaughtUp)
                {
                    _stateOfTheWorldUpdates.OnNext(_stateOfTheWorld);
                }
            });

            _eventsConnection.Disposable = _events.Connect();
        }

        private IObservable<TOutput> GetOutputStreamImpl()
        {
            return Observable.Create<TOutput>(obs =>
            {
                if (Log.IsInfoEnabled)
                {
                    Log.Info("Creating observable for update stream");
                }

                var sotw = _stateOfTheWorldUpdates.Where(x => x != null)
                                                  .Take(1)
                                                  .Select(x => BuildStateOfTheWorldDto(x.Values));

                return sotw.Concat(_events.Select(evt => MapSingleEventToUpdateDto(_stateOfTheWorld, evt)))
                          .Where(IsValidUpdate)
                          .Subscribe(obs);
            });
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
                return Disposable.Create(() => subscription.Stop());
            });
        }

        public void Dispose()
        {
            _eventsSubscription.Dispose();
            _eventsConnection.Dispose();
            Disposables.Dispose();
            OnDispose();
        }

        protected virtual void OnDispose()
        {
        }
    }
}
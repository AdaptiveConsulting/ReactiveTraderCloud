using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Text;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Newtonsoft.Json;
using ReferenceDataRead.Events;

namespace ReferenceDataRead
{
    public class CurrencyPairCache
    {
        private const string EventStoreUri = "tcp://admin:changeit@127.0.0.1:1113";
        private const string CurrencyPairCreatedEventType = "Currency Pair Created";
        private const string CurrencyPairChangedEventType = "Currency Pair Changed";
        private const string CurrencyPairActivatedEventType = "Currency Pair Activated";
        private const string CurrencyPairDeactivatedEventType = "Currency Pair Deactivated";

        private Task<ImmutableDictionary<string, CurrencyPair>> _populatedTask;

        private static readonly ISet<string> CurrencyPairEventTypes = new HashSet<string>
        {
            CurrencyPairCreatedEventType,
            CurrencyPairChangedEventType,
            CurrencyPairActivatedEventType,
            CurrencyPairDeactivatedEventType
        };

        public Task Populate()
        {
            _populatedTask = GetAllEvents(EventStoreUri)
                .Where(x => CurrencyPairEventTypes.Contains(x.Event.EventType))
                .Select(x => x.Event)
                .Scan(ImmutableDictionary.Create<string, CurrencyPair>(), UpdateCurrencyPairs)
                .ToTask();

            return _populatedTask;
        }

        public IEnumerable<CurrencyPair> GetAll()
        {
            return _populatedTask.Result.Values;
        }

        private IObservable<ResolvedEvent> GetAllEvents(string eventStoreUri)
        {
            return Observable.Create<ResolvedEvent>(async o =>
            {
                var conn = await Connect(eventStoreUri);

                Action<EventStoreCatchUpSubscription, ResolvedEvent> callback = (arg1, arg2) => o.OnNext(arg2);

                // For the moment complete the stream here, to get a completed task out above.
                // TODO: Handle this properly so we publish updates to a stream
                Action<EventStoreCatchUpSubscription> liveProcessingStarted = subs => o.OnCompleted();

                var subscription = conn.SubscribeToAllFrom(Position.Start, false, callback, liveProcessingStarted);
                return new CompositeDisposable(Disposable.Create(() => subscription.Stop()), conn);
            });
        }

        private ImmutableDictionary<string, CurrencyPair> UpdateCurrencyPairs(ImmutableDictionary<string, CurrencyPair> currencyPairs, RecordedEvent evt)
        {
            // TODO: We probably don't really want to do this via an immutable dictionary, but doing things in an Rx .Scan is a nice way to build up some state.
            ImmutableDictionary<string, CurrencyPair> result = currencyPairs;
            switch (evt.EventType)
            {
                case CurrencyPairCreatedEventType:
                    var createdEvent = GetEvent<CurrencyPairCreatedEvent>(evt);
                    result= currencyPairs.Add(createdEvent.Symbol, new CurrencyPair(createdEvent.Symbol, createdEvent.PipsPosition, createdEvent.RatePrecision, createdEvent.SampleRate, createdEvent.Comment));
                    break;
                case CurrencyPairActivatedEventType:
                    var activatedEvent = GetEvent<CurrencyPairActivatedEvent>(evt);
                    var ccyPair = currencyPairs[activatedEvent.Symbol];
                    ccyPair.IsEnabled = true;
                    result = currencyPairs.SetItem(activatedEvent.Symbol, ccyPair);
                    break;
                case CurrencyPairDeactivatedEventType:
                    var deactivatedEvent = GetEvent<CurrencyPairActivatedEvent>(evt);
                    var ccyPair2 = currencyPairs[deactivatedEvent.Symbol];
                    ccyPair2.IsEnabled = false;
                    result = currencyPairs.SetItem(deactivatedEvent.Symbol, ccyPair2);
                    break;
                case CurrencyPairChangedEventType:
                    break;
                default:
                    throw new ArgumentOutOfRangeException("Unsupported CurrencyPair event type");
            }

            return result;
        }

        private T GetEvent<T>(RecordedEvent evt)
        {
            var eventString = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject<T>(eventString);
        }

        private async Task<IEventStoreConnection> Connect(string uriString)
        {
            var connectionSettings = ConnectionSettings.Create().KeepReconnecting();

            var uri = new Uri(uriString);
            var conn = EventStoreConnection.Create(connectionSettings, uri);
            await conn.ConnectAsync();
            return conn;
        }
    }
}
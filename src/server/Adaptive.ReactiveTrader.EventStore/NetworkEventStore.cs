using System;
using System.Threading.Tasks;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class NetworkEventStore : IEventStore
    {
        private readonly Uri _eventStoreUri = new Uri("tcp://admin:changeit@127.0.0.1:1113");
        private IEventStoreConnection _conn;

        public class Event : IEvent
        {
            private readonly ResolvedEvent _resolvedEvent;

            public Event(ResolvedEvent resolvedEvent)
            {
                _resolvedEvent = resolvedEvent;
            }

            public string EventType => _resolvedEvent.Event.EventType;

            public byte[] Data => _resolvedEvent.Event.Data;
        }

        public NetworkEventStore(Uri uri)
        {
            _eventStoreUri = uri;

            var connectionSettings = ConnectionSettings.Create().KeepReconnecting();
            _conn = EventStoreConnection.Create(connectionSettings, uri);
        }


        public NetworkEventStore()
        {
            var connectionSettings = ConnectionSettings.Create().KeepReconnecting();
            _conn = EventStoreConnection.Create(connectionSettings, _eventStoreUri);
        }

        public Task AppendToStreamAsync(string streamName, int noStream, EventData eventData)
        {
            return _conn.AppendToStreamAsync(streamName, noStream, eventData);
        }

        public IEventStoreSubscription SubscribeToAllFrom(Position start, bool b, Action<IEvent> onEvent,
            Action<EventStoreCatchUpSubscription> onCaughtUp)
        {
            return new WrappSubscription(_conn.SubscribeToAllFrom(start, b, (s, e) =>
            {
                onEvent(new Event(e));
            }, onCaughtUp));
        }


        public IEventStoreSubscription SubscribeToAllFrom(Position start, bool b,
            Action<EventStoreCatchUpSubscription, ResolvedEvent> onEvent,
            Action<EventStoreCatchUpSubscription> onCaughtUp)
        {
            return new WrappSubscription(_conn.SubscribeToAllFrom(start, b, onEvent, onCaughtUp));
        }

        private class WrappSubscription : IEventStoreSubscription
        {
            private readonly EventStoreAllCatchUpSubscription _subscribeToAllFrom;

            public WrappSubscription(EventStoreAllCatchUpSubscription subscribeToAllFrom)
            {
                _subscribeToAllFrom = subscribeToAllFrom;
            }

            public void Stop()
            {
                _subscribeToAllFrom.Stop();
            }
        }

        public async Task Connect()
        {
            await _conn.ConnectAsync();
        }
    }
}
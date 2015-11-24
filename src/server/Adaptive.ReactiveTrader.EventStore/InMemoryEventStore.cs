using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public interface IEvent
    {
        string EventType { get; }
        byte[] Data { get; }
    }

    public class InMemoryEventStore : IEventStore
    {
        private class EventStoreEntry
        {
            public string Name { get; set; }
            public EventData EventData { get; set; }
        }

        private class Subscription : IEventStoreSubscription
        {
            public void Stop()
            {
            }
        }

        private class Event : IEvent
        {
            private readonly EventStoreEntry _resolvedEvent;

            public Event(EventStoreEntry resolvedEvent)
            {
                _resolvedEvent = resolvedEvent;
            }

            public string EventType => _resolvedEvent.EventData.Type;

            public byte[] Data => _resolvedEvent.EventData.Data;
        }

        private readonly List<EventStoreEntry> _entries = new List<EventStoreEntry>();

        public Task AppendToStreamAsync(string streamName, int noStream, EventData eventData)
        {
            _entries.Add(new EventStoreEntry {Name = streamName, EventData = eventData});

            return Task.Run(() => { });
        }

        public IEventStoreSubscription SubscribeToAllFrom(Position start, bool b,
            Action<IEvent> onEvent,
            Action<EventStoreCatchUpSubscription> onCaughtUp)
        {
            var sub = new Subscription();

            foreach (var i in _entries)
                onEvent(new Event(i));

            onCaughtUp(null);

            return sub;
        }
    }
}
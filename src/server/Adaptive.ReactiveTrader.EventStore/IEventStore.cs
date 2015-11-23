using System;
using System.Threading.Tasks;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public interface IEventStore
    {
        Task AppendToStreamAsync(string streamName, int noStream, EventData eventData);
        IEventStoreSubscription SubscribeToAllFrom(Position start, bool b, Action<IEvent> onEvent, Action<EventStoreCatchUpSubscription> onCaughtUp);
    }

    public interface IEventStoreSubscription
    {
        void Stop();
    }
}
using Adaptive.ReactiveTrader.Common.Config;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class EventStoreConnectionFactory
    {
        public static IEventStoreConnection Create(EventStoreLocation eventStoreLocation, IEventStoreConfiguration configuration)
        {
            IEventStore eventStore;

            if (eventStoreLocation == EventStoreLocation.Embedded)
            {
                eventStore = new EmbeddedEventStore();
            }
            else
            {
                eventStore = new ExternalEventStore(EventStoreUri.FromConfig(configuration));
            }

            return eventStore.Connection;
        }
    }
}
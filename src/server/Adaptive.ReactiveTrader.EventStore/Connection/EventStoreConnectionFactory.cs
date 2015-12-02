using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.EventStore.Connection
{
    public class EventStoreConnectionFactory
    {
        public static IMonitoredEventStoreConnection Create(EventStoreLocation eventStoreLocation, IEventStoreConfiguration configuration)
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

            return new MonitoredEventStoreConnection(eventStore.Connection);
        }
    }
}
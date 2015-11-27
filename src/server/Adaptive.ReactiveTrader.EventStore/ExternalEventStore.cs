using EventStore.ClientAPI;
using System;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class ExternalEventStore : IEventStore
    {
        public ExternalEventStore(Uri uri)
        {
            var connectionSettings = ConnectionSettings.Create().KeepReconnecting();
            Connection = EventStoreConnection.Create(connectionSettings, uri);
        }

        public ExternalEventStore() : this(EventStoreConstants.DefaultConnectionUri)
        {
        }

        public IEventStoreConnection Connection { get; }
    }
}

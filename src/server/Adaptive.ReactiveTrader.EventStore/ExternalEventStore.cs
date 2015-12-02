using EventStore.ClientAPI;
using System;
using Adaptive.ReactiveTrader.EventStore.Connection;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class ExternalEventStore : IEventStore
    {
        public ExternalEventStore(Uri uri)
        {
            Connection = EventStoreConnection.Create(EventStoreConnectionSettings.Default, uri);
        }
        
        public IEventStoreConnection Connection { get; }
    }
}

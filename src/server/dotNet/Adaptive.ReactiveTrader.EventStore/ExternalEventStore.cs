using System;
using Adaptive.ReactiveTrader.EventStore.Connection;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class ExternalEventStore : IEventStore
    {
        public ExternalEventStore(Uri uri)
        {
            Connection = EventStoreConnection.Create(EventStoreConnectionSettings.Default, uri).Result;
        }

        public IEventStoreConnection Connection { get; }
    }
}
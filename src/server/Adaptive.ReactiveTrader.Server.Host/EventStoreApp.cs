using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public class EventStoreApp : App<IServiceHostFactoryWithEventStore>
    {
        public EventStoreApp(IServiceConfiguration config, IServiceHostFactoryWithEventStore factory) : base(config, factory)
        {
        }

        private static IEventStoreConnection GetEventStoreConnection(IEventStoreConfiguration configuration)
        {
            var eventStoreConnection =
                EventStoreConnectionFactory.Create(
                    EventStoreLocation.External,
                    configuration);

            return eventStoreConnection;
        }

        protected override IDisposable InitializeFactory(IObservable<IConnected<IBroker>> brokerStream)
        {
            var eventStoreConnection = GetEventStoreConnection(Config.EventStore);
            var mon = new ConnectionStatusMonitor(eventStoreConnection);
            var esStream = mon.GetEventStoreConnectedStream(eventStoreConnection);
            eventStoreConnection.ConnectAsync().Wait();

            return Factory.Initialize(brokerStream, esStream);
        }
    }
}
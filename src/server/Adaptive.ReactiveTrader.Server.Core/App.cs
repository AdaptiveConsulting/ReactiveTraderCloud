using System;
using System.Reactive.Disposables;
using System.Threading;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Common.Logging.Simple;

namespace Adaptive.ReactiveTrader.Server.Core
{
    public class App
    {
        private static readonly ILog Log = LogManager.GetLogger<App>();

        public static void Run(string[] args, IServiceHostFactory factory)
        {
            var config = ServiceConfiguration.FromArgs(args);

            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
            {
                ShowLogName = true
            };

            try
            {
                using (InitializeEventStore(factory, config.EventStore))
                using (var brokerFactory = BrokerConnectionFactory.Create(config.Broker))
                {
                    brokerFactory.Register(factory);
                    brokerFactory.Start();

                    while (true)
                        Thread.Sleep(ThreadSleep);
                }
            }
            catch (Exception e)
            {
                Log.Error(e);
            }
        }

        private static IDisposable InitializeEventStore(IServiceHostFactory factory, IEventStoreConfiguration config)
        {
            var eventStoreConsumer = factory as IEventStoreConsumer;
            if (eventStoreConsumer == null) return Disposable.Empty;

            var eventStoreConnection = EventStoreConnectionFactory.Create(EventStoreLocation.External, config);
            eventStoreConnection.ConnectAsync().Wait();

            eventStoreConsumer.Initialize(eventStoreConnection);

            return eventStoreConnection;
        }

        public const int ThreadSleep = 5000;
    }
}
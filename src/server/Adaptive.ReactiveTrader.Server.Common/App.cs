using System;
using System.Reactive.Disposables;
using System.Threading;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Common.Logging.Simple;

namespace Adaptive.ReactiveTrader.Server.Common
{
    public class App
    {
        private static readonly ILog Log = LogManager.GetLogger<App>();

        public static void Run(string[] args, IServiceHostFactory factory)
        {
            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
            {
                ShowLogName = true
            };

            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            if (args.Length > 0)
                uri = args[0];
            if (args.Length > 1)
                realm = args[1];


            try
            {
                using (InitializeEventStore(factory))
                using (var brokerFactory = BrokerConnectionFactory.Create(uri, realm))
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

        private static IDisposable InitializeEventStore(IServiceHostFactory factory)
        {
            var eventStoreConsumer = factory as IEventStoreConsumer;
            if (eventStoreConsumer == null) return Disposable.Empty;

            var es = new ExternalEventStore();
            es.Connection.ConnectAsync().Wait();

            eventStoreConsumer.Initialize(es.Connection);

            return es.Connection;
        }

        public const int ThreadSleep = 5000;
    }
}
using System;
using System.Linq;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Adaptive.ReactiveTrader.Server.TradeExecution;
using Common.Logging;
using Common.Logging.Simple;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public static void Main(string[] args)
        {
            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
            {
                ShowLogName = true
            };

            try
            {
                var eventStoreConnection = GetEventStoreConnection(args.Contains("es")).Result;

                var compositeDispo = new CompositeDisposable();

                if (args.Contains("mb"))
                    compositeDispo.Add(MessageBrokerLauncher.Run());

                var broker = BrokerFactory.Create(uri, realm);

                if (args.Contains("p"))
                    compositeDispo.Add(PriceServiceLauncher.Run(broker.Result).Result);

                if (args.Contains("ref"))
                    compositeDispo.Add(ReferenceDataReaderLauncher.Run(eventStoreConnection, broker.Result).Result);
                    compositeDispo.Add(ReferenceDataWriterLauncher.Run(eventStoreConnection, broker.Result).Result);

                if (args.Contains("exec"))
                    compositeDispo.Add(TradeExecutionLauncher.Run(eventStoreConnection, broker.Result).Result);

                using (compositeDispo)
                {
                    Console.WriteLine("Press Any Key To Stop...");
                    Console.ReadLine();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.ReadLine();
            }
        }

        private static async Task<IEventStoreConnection> GetEventStoreConnection(bool embedded)
        {
            IEventStore eventStore;

            if (embedded)
            {
                eventStore = new EmbeddedEventStore();
                await eventStore.Connection.ConnectAsync();
                await ReferenceDataWriterLauncher.PopulateRefData(eventStore.Connection);
            }
            else
            {
                eventStore = new ExternalEventStore();
                await eventStore.Connection.ConnectAsync();
            }

            return eventStore.Connection;
        }
    }
}
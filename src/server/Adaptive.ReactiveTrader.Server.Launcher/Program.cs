using System;
using System.Linq;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Common.Logging;
using Common.Logging.Simple;

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
                IEventStore es;

                if (args.Contains("es"))
                {
                    es = new InMemoryEventStore();
                    ReferenceDataWriterLauncher.Initialize(es).Wait();
                }
                else
                {
                    var news = new NetworkEventStore();
                    news.Connect().Wait();
                    es = news;
                }

                var compositeDispo = new CompositeDisposable();

                if (args.Contains("mb"))
                    compositeDispo.Add(MessageBrokerLauncher.Run());

                var broker = BrokerFactory.Create(uri, realm);

                if (args.Contains("p"))
                    compositeDispo.Add(PriceServiceLauncher.Run(broker.Result).Result);

                if (args.Contains("ref"))
                    compositeDispo.Add(ReferenceDataReaderLauncher.Run(es, broker.Result).Result);

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
    }
}
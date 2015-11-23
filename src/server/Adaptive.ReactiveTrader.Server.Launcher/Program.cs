using System;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public static void Main(string[] args)
        {
            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            if (args.Length > 0)
                uri = args[0];
            if (args.Length > 1)
                realm = args[1];

            try
            {
                var broker = BrokerFactory.Create(uri, realm);

                var memoryEventStore = true;
                IEventStore es;

                if (memoryEventStore)
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

                using (MessageBrokerLauncher.Run())
                using (PriceServiceLauncher.Run(broker.Result).Result)
                using (ReferenceDataReaderLauncher.Run(es, broker.Result).Result)
                {
                    Console.WriteLine("Press Any Key To Stop...");
                    Console.ReadLine();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}

using System;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Common.Config;
using Common.Logging;
using Common.Logging.Simple;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public static void Main(string[] args)
        {
            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
            {
                ShowLogName = true
            };
            
            try
            {

                var config = ServiceConfiguration.FromArgs(args);
                var broker = BrokerFactory.Create(config.Broker);
                var eventStoreConnection = EventStoreConnectionFactory.Create(EventStoreLocation.External, config.EventStore);
                eventStoreConnection.ConnectAsync().Wait();

                using (ReferenceDataReaderLauncher.Run(eventStoreConnection, broker.Result).Result)
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
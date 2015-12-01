using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Common.Logging.Simple;
using System;
using Adaptive.ReactiveTrader.Server.Common.Config;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public void Main(string[] args)
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

                using (ReferenceDataWriterLauncher.Run(eventStoreConnection, broker.Result).Result)
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

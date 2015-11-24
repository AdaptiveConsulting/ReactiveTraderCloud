using System;
using Adaptive.ReactiveTrader.EventStore;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        public void Main(string[] args)
        {
            var eventStore = new NetworkEventStore();
            eventStore.Connect().Wait();
            var repository = new CurrencyPairRepository(eventStore);

            if (args.Length > 0)
            {
                switch (args[0])
                {
                    case "populate":
                        Log.Info("Populating Event Store...");
                        new CurrencyPairInitializer(repository).WriteInitialEventsAsync().Wait();
                        Log.Info("Completed");
                        break;
                    case "modify":
                        Console.WriteLine("Press a key to deactivate GBPJPY");
                        Console.ReadKey();

                        repository.Deactivate("GBPJPY");

                        Console.WriteLine("Press a key to activate it again");
                        Console.ReadKey();

                        repository.Activate("GBPJPY");
                        break;
                }
            }

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }
    }
}

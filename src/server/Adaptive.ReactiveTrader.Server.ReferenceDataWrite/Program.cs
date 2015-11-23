using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using System;
using System.Net;


namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        public void Main(string[] args)
        {
            var eventStore = new NetworkEventStore();
            var repository = new CurrencyPairRepository(eventStore);

            if (args.Length > 0)
            {
                switch (args[0])
                {
                    case "populate":
                        Console.WriteLine("Populating Event Store...");
                        new CurrencyPairInitializer(repository).WriteInitialEventsAsync().Wait();
                        Console.WriteLine("Completed");
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

using EventStore.ClientAPI;
using System;
using System.Net;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        public void Main(string[] args)
        {
            var connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
            connection.ConnectAsync().Wait();

            var repository = new CurrencyPairRepository(connection);

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

using System;
using System.Net;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class Program
    {
        public void Main(string[] args)
        {
            var connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
            connection.ConnectAsync().Wait();

            var repository = new CurrencyPairRepository(connection);
            //new CurrencyPairInitializer(repository).WriteInitialEventsAsync().Wait();

            Console.WriteLine("Press a key to deactivate GBPJPY");
            Console.ReadKey();

            repository.Deactivate("GBPJPY");

            Console.WriteLine("Press a key to activate it again");
            Console.ReadKey();

            repository.Activate("GBPJPY");

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }
    }
}

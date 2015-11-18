using EventStore.ClientAPI;
using System;
using System.Net;

namespace ReferenceDataWrite
{
    public class Program
    {
        public void Main(string[] args)
        {
            var connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
            connection.ConnectAsync().Wait();

            var repository = new CurrencyPairRepository(connection);
            new CurrencyPairInitializer(repository).WriteInitialEventsAsync().Wait();

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }
    }
}

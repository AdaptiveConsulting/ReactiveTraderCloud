using EventStore.ClientAPI;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EventStoreSpike
{
    public class Program
    {
        private static IEventStoreConnection _connection;

        public void Main(string[] args)
        {
            EmbeddedServerFactory.Create();

            Console.WriteLine("Embedded Event Store created");
            Console.WriteLine("Press a key to continue");
            Console.ReadKey();

            _connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
            _connection.ConnectAsync().Wait();

            var symbol = "GBPUSD";

            CreateCurrencyPair(symbol, 10000000m).Wait();
            Console.WriteLine("Created CCY Pair");

            Task.Delay(1000).Wait();

            ActivateCurrencyPair(symbol).Wait();
            Console.WriteLine("Activated CCY Pair");

            Task.Delay(1000).Wait();

            DeactivateCurrencyPair(symbol).Wait();
            Console.WriteLine("Deactivated CCY Pair");

            var eventSlice = _connection.ReadStreamEventsForwardAsync(GetStreamName(symbol), 0, 1000, false).Result;

            foreach (var evt in eventSlice.Events.Select(x => x.Event))
            {
                var value = Encoding.UTF8.GetString(evt.Data);
                Console.WriteLine($"Read Event. Name: {evt.EventType}, Data: {value}");
            }

            Console.WriteLine("Press Enter to exit");

            Console.ReadLine();
        }

        public static async Task CreateCurrencyPair(string symbol, decimal dealableLimit)
        {
            var evt = new CurrencyPairCreatedEvent(symbol, 10000000m);
            var text = $"{evt.Symbol}-{evt.DealableLimit}";
            var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

            await _connection.AppendToStreamAsync(GetStreamName(symbol), ExpectedVersion.NoStream, eventData);
        }

        public static async Task ActivateCurrencyPair(string symbol)
        {
            var evt = new CurrencyPairActivatedEvent(symbol);
            var text = $"{evt.Symbol}";
            var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

            await _connection.AppendToStreamAsync(GetStreamName(symbol), ExpectedVersion.Any, eventData);
        }

        public static async Task DeactivateCurrencyPair(string symbol)
        {
            var evt = new CurrencyPairDeactivatedEvent(symbol);
            var text = $"{evt.Symbol}";
            var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

            await _connection.AppendToStreamAsync(GetStreamName(symbol), ExpectedVersion.Any, eventData);
        }

        private static string GetStreamName(string symbol)
        {
            return $"CcyPair-{symbol}";
        }
    }
}

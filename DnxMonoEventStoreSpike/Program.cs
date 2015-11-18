using System;
using EventStore.ClientAPI;
using System.Threading.Tasks;
using System.Net;
using System.Text;

namespace MonoEventStore
{
	public class Program
	{
		private static IEventStoreConnection _connection;

		public static void Main(string[] args)
		{
			//_connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Parse("172.19.153.236"), 1113));
			_connection = EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));
			_connection.ConnectAsync().Wait();

			var symbol = "GBPUSD";

//  			CreateCurrencyPair(symbol, 10000000m).Wait();
//  			Console.WriteLine("Created CCY Pair");
//  
//  			Task.Delay(1000).Wait();

			ActivateCurrencyPair(symbol).Wait();
			Console.WriteLine("Activated CCY Pair");

			Task.Delay(1000).Wait();

			DeactivateCurrencyPair(symbol).Wait();
			Console.WriteLine("Deactivated CCY Pair");

			Console.WriteLine("Press Enter to exit");

			Console.ReadLine();
		}

		public static async Task CreateCurrencyPair(string symbol, decimal dealableLimit)
		{
			var evt = new CurrencyPairCreated(symbol, 10000000m);
			var text = $"{evt.Symbol}-{evt.DealableLimit}";
			var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

			await _connection.AppendToStreamAsync($"CcyPair-{symbol}", ExpectedVersion.NoStream, eventData);
		}

		public static async Task ActivateCurrencyPair(string symbol)
		{
			var evt = new CurrencyPairActivated(symbol);
			var text = $"{evt.Symbol}";
			var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

			await _connection.AppendToStreamAsync($"CcyPair-{symbol}", ExpectedVersion.Any, eventData);
		}

		public static async Task DeactivateCurrencyPair(string symbol)
		{
			var evt = new CurrencyPairDeactivated(symbol);
			var text = $"{evt.Symbol}";
			var eventData = new EventData(Guid.NewGuid(), evt.Name, false, Encoding.UTF8.GetBytes(text), new byte[0]);

			await _connection.AppendToStreamAsync($"CcyPair-{symbol}", ExpectedVersion.Any, eventData);
		}
	}

	public class CurrencyPairCreated
	{
		public string Symbol { get; }
		public decimal DealableLimit { get; }
		public string Name { get; } = "Currency Pair Created";

		public CurrencyPairCreated(string symbol, decimal dealableLimit)
		{
			Symbol = symbol;
			DealableLimit = dealableLimit;
		}
	}

	public class CurrencyPairActivated
	{
		public string Symbol { get; }
		public string Name { get; } = "Currency Pair Activated";

		public CurrencyPairActivated(string symbol)
		{
			Symbol = symbol;
		}
	}

	public class CurrencyPairDeactivated
	{
		public string Symbol { get; }
		public string Name { get; } = "Currency Pair Deactivated";

		public CurrencyPairDeactivated(string symbol)
		{
			Symbol = symbol;
		}
	}
}

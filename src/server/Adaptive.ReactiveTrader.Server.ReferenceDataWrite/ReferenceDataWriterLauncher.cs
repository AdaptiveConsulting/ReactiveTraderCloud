using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriterLauncher
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataWriterLauncher>();

        public static async Task Initialize(IEventStore eventStore)
        {
            Log.Info("Reference Writer Service starting...");
            var repository = new CurrencyPairRepository(eventStore);
            Log.Info("Initializing Event Store with Currency Pair Data");
            await new CurrencyPairInitializer(repository).WriteInitialEventsAsync();
        }
        
        public static async Task Run(IEventStore eventStore)
        {
            var repository = new CurrencyPairRepository(eventStore);

            Console.WriteLine("Press a key to deactivate GBPJPY");
            Console.ReadKey();

            await repository.Deactivate("GBPJPY");

            Console.WriteLine("Press a key to activate it again");
            Console.ReadKey();

            await repository.Activate("GBPJPY");

            Console.WriteLine("Press a key to exit");
            Console.ReadKey();
        }
    }
}
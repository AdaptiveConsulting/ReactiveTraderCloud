using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.EventStore;
using EventStore.ClientAPI;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public static class ReferenceDataHelper
    {
        public static async Task PopulateRefData(IEventStoreConnection eventStoreConnection)
        {
            Log.Information("Reference Writer Service starting...");
            var repository = new Repository(eventStoreConnection, new EventTypeResolver(ReflectionHelper.ContractsAssembly));
            Log.Information("Initializing Event Store with Currency Pair Data");
            await new CurrencyPairInitializer(repository).CreateInitialCurrencyPairsAsync();
        }
    }
}

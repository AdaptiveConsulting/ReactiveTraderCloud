using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataHelper
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataHelper>();

        public static async Task PopulateRefData(IEventStoreConnection eventStoreConnection)
        {
            Log.Info("Reference Writer Service starting...");
            var repository = new Repository(eventStoreConnection);
            Log.Info("Initializing Event Store with Currency Pair Data");
            await new CurrencyPairInitializer(repository).CreateInitialCurrencyPairsAsync();
        }
    }
}
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;
using System;
using System.Threading.Tasks;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriterLauncher
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataWriterLauncher>();

        public static async Task PopulateRefData(IEventStoreConnection eventStoreConnection)
        {
            Log.Info("Reference Writer Service starting...");
            var repository = new Repository(eventStoreConnection);
            Log.Info("Initializing Event Store with Currency Pair Data");
            await new CurrencyPairInitializer(repository).CreateInitialCurrencyPairsAsync();
        }

        public static async Task<IDisposable> Run(IEventStoreConnection eventStoreConnection, IBroker broker)
        {
            Log.Info("Reference Data Write Service starting...");

            try
            {
                var service = new RefDataWriteService(new Repository(eventStoreConnection));
                var serviceHost = new RefDataWriteServiceHost(service, broker);

                await serviceHost.Start();

                Log.Info("Service Started.");

                return serviceHost;
            }

            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}
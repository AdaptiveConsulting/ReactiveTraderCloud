using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReaderLauncher
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataReaderLauncher>();

        public static async Task<IDisposable> Run(IEventStoreConnection es, IBroker broker)
        {
            Log.Info("Reference Data Read Service starting...");
            try
            {
                var cache = new CurrencyPairCache(es);
                cache.Initialize();

                var service = new ReferenceService(cache.GetCurrencyPairUpdates());
                var serviceHost = new ReferenceServiceHost(service, broker);

                await serviceHost.Start();

                Log.Info("Service Started.");
                
                return new CompositeDisposable {cache, serviceHost};

            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}
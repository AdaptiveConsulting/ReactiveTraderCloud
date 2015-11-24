using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public static class ReferenceDataReaderLauncher
    {
        public static async Task<IDisposable> Run(IEventStore es, IBroker broker)
        {
            Console.WriteLine("Reference Data Service starting...");
            try
            {
                var cache = new CurrencyPairCache(es);
                cache.Initialize();

                var service = new ReferenceService(cache.GetCurrencyPairUpdates());
                var serviceHost = new ReferenceServiceHost(service, broker);

                await serviceHost.Start();

                Console.WriteLine("procedure GetCurrencyPairs() registered");

                Console.WriteLine("Service Started.");
                
                return serviceHost;

            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }
        }
    }
}
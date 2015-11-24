using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceLauncher
    {
        protected static readonly ILog Log = LogManager.GetLogger<PriceServiceLauncher>();

        public static async Task<IDisposable> Run(IBroker broker)
        {
            var cache = new PriceGenerator();
            var service = new PricingService(cache.GetPriceStream);
            var serviceHost = new PricingServiceHost(service, broker);
            
            try
            {
               Log.Info("Pricing Data Service starting...");
                await serviceHost.Start();
            }
            catch (MessagingException e)
            {
                Log.Error(e);
                throw new Exception("Can't start service", e);
            }

            Log.Info("Service Started.");

            return serviceHost;
        }
    }
}
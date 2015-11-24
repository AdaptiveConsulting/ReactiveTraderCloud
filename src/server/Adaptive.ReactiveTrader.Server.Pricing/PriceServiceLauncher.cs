using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceLauncher
    {
        public static async Task<IDisposable> Run(IBroker broker)
        {
            var cache = new PriceGenerator();

            var service = new PricingService(cache.GetPriceStream);
            var serviceHost = new PricingServiceHost(service, broker);
            try
            {
                Console.WriteLine("Pricing Data Service starting...");
                await serviceHost.Start();
            }
            catch (MessagingException e)
            {
                throw new Exception("Can't start service", e);
            }

            Console.WriteLine("Service Started.");

            return serviceHost;
        }
    }
}
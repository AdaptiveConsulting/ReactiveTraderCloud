using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceHostFactory : IServiceHostFactory, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PriceServiceHostFactory>();

        private readonly PricingService _service;
        private readonly PriceGenerator _cache;

        public PriceServiceHostFactory()
        {
            _cache = new PriceGenerator();
            Log.Info("Started Generator");

            _service = new PricingService(_cache.GetPriceStream);
            Log.Info("Started Service");
        }

        public async Task<ServiceHostBase> Create(IBroker broker)
        {
            Log.Info("Pricing Data Service Starting...");
            var serviceHost = new PricingServiceHost(_service, broker);
            await serviceHost.Start();
            Log.Info("Pricing Data Service Started.");

            return serviceHost;
        }

        public void Dispose()
        {
            _cache.Dispose();
        }
    }
}
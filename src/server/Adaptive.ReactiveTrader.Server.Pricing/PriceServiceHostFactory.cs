using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceHostFactory : IServceHostFactor, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PriceServiceHostFactory>();

        private readonly PricingService _service;
        private readonly PriceGenerator _cache;

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        public PriceServiceHostFactory()
        {
            _cache = new PriceGenerator();
            Log.Info("Started Generator");

            _service = new PricingService(_cache.GetPriceStream);
            Log.Info("Started Service");
        }
        
        public void Initialize(IObservable<IConnected<IBroker>> brokerStream)
        {
            _cleanup.Add(brokerStream.LaunchOrKill(broker => new PricingServiceHost(_service, broker)).Subscribe());
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
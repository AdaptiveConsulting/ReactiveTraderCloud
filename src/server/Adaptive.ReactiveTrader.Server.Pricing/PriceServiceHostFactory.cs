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

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        public PriceServiceHostFactory()
        {
            var cache = new PriceGenerator();
            Log.Info("Started Generator");

            _service = new PricingService(cache.GetPriceStream);
            Log.Info("Started Service");

            _cleanup.Add(cache);
        }
        
        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream)
        {
            var disposable = brokerStream.LaunchOrKill(broker => new PricingServiceHost(_service, broker)).Subscribe();

            _cleanup.Add(disposable);

            return disposable;
        }

        public void Dispose()
        {
            _cleanup.Dispose();
        }
    }
}
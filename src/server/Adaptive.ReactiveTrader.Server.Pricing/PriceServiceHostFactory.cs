using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceHostFactory : IServiceHostFactory, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PriceServiceHostFactory>();

        private readonly PricingService _service;

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        public PriceServiceHostFactory()
        {
            var priceSource = new PriceSource();
            Log.Info("Started Generator");

            _service = new PricingService(priceSource);
            Log.Info("Started Service");

            _cleanup.Add(priceSource);
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
using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PriceServiceHostFactory : IServiceHostFactory
    {
        //protected static readonly ILogger Log = Log.ForContext<PriceServiceHostFactory>();

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        private readonly PricingService _service;

        public PriceServiceHostFactory()
        {
            var priceSource = new PriceSource();
            Log.Information("Started Generator");

            _service = new PricingService(priceSource);
            Log.Information("Started Service");

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
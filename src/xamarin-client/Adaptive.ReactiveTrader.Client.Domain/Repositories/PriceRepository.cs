using System;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Adaptive.ReactiveTrader.Shared.Logging;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    internal class PriceRepository : IPriceRepository
    {
        private readonly IPricingServiceClient _pricingServiceClient;
        private readonly IPriceFactory _priceFactory;
        private readonly ILog _log;

        public PriceRepository(IPricingServiceClient pricingServiceClient, IPriceFactory priceFactory, ILoggerFactory loggerFactory)
        {
            _pricingServiceClient = pricingServiceClient;
            _priceFactory = priceFactory;
            _log = loggerFactory.Create(typeof (PriceRepository));
        }

        public IObservable<IPrice> GetPriceStream(ICurrencyPair currencyPair)
        {
            return Observable.Defer(() => _pricingServiceClient.GetSpotStream(currencyPair.Symbol))
                .Select(p => _priceFactory.Create(p, currencyPair))
                .Catch<IPrice, Exception>(ex =>
                {
                    _log.Error("Error thrown in stream " + currencyPair.Symbol, ex);
                    // if the stream errors (server disconnected), we push a stale price 
                    return Observable
                            .Return<IPrice>(new StalePrice(currencyPair))
                            // terminate the observable in 3sec so the repeat does not kick-off immediatly
                            .Concat(Observable.Timer(TimeSpan.FromSeconds(3)).IgnoreElements().Select(_ => new StalePrice(currencyPair)));
                }) 
                .Repeat()                                               // and resubscribe
                .DetectStale(TimeSpan.FromSeconds(4),  Scheduler.Default)
                .Select(s => s.IsStale ? new StalePrice(currencyPair) : s.Update)
                .Publish()
                .RefCount();
        }
    }
}
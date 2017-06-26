using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Concurrency;
using Adaptive.ReactiveTrader.Client.Domain.Instrumentation;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;
using Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp;
using Adaptive.ReactiveTrader.Shared.Logging;

namespace Adaptive.ReactiveTrader.Client.Domain
{
    public class ReactiveTrader : IReactiveTrader, IDisposable
    {
        private ILoggerFactory _loggerFactory;
        private ILog _log;
        private WampServiceClientContainer _serviceClientContainer;

        public void Initialize(string username, string[] servers, ILoggerFactory loggerFactory = null, string authToken = null)
        {
            _loggerFactory = loggerFactory ?? new DebugLoggerFactory();
            _log = _loggerFactory.Create(typeof(ReactiveTrader));
            var concurrencyService = new ConcurrencyService();

            _serviceClientContainer = new WampServiceClientContainer(servers[0], username, concurrencyService, _loggerFactory);
            _serviceClientContainer.ConnectAsync();

            var referenceDataServiceClient = new ReferenceDataServiceClient(_serviceClientContainer.Reference, _loggerFactory);
            var executionServiceClient = new ExecutionServiceClient(_serviceClientContainer.Execution);
            var blotterServiceClient = new BlotterServiceClient(_serviceClientContainer.Blotter, _loggerFactory);
            var pricingServiceClient = new PricingServiceClient(_serviceClientContainer.Pricing, _loggerFactory);
            PricingServiceClient = pricingServiceClient;
            PriceLatencyRecorder = new PriceLatencyRecorder();

            var tradeFactory = new TradeFactory();
            var executionRepository = new ExecutionRepository(executionServiceClient, tradeFactory, concurrencyService);
            var priceFactory = new PriceFactory(executionRepository, PriceLatencyRecorder);
            var priceRepository = new PriceRepository(pricingServiceClient, priceFactory, _loggerFactory);
            var currencyPairUpdateFactory = new CurrencyPairUpdateFactory(priceRepository);
            TradeRepository = new TradeRepository(blotterServiceClient, tradeFactory);
            ReferenceData = new ReferenceDataRepository(referenceDataServiceClient, currencyPairUpdateFactory);
        }

        public IReferenceDataRepository ReferenceData { get; private set; }
        public ITradeRepository TradeRepository { get; private set; }
        public IPriceLatencyRecorder PriceLatencyRecorder { get; private set; }
        public IPricingServiceClient PricingServiceClient { get; private set; }

        public IObservable<ConnectionInfo> ConnectionStatusStream
        {
            get
            {
                return _serviceClientContainer.ConnectionStatusStream
                    .Publish()
                    .RefCount();
            }
        }

        public void Dispose()
        {
            _serviceClientContainer.Dispose();
        }
    }
}
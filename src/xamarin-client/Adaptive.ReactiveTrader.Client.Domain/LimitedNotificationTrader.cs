using System;
using Adaptive.ReactiveTrader.Client.Domain.Instrumentation;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Repositories;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;
using Adaptive.ReactiveTrader.Shared.Logging;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain
{
    public class LimitedNotificationTrader : IDisposable
    {
        class WatchPricingServiceClient : IPricingServiceClient
        {
            readonly IObservable<PriceDto> _priceStream;

            public WatchPricingServiceClient(IObservable<PriceDto> priceStrean)
            {
                _priceStream = priceStrean;                
            }

            public IObservable<PriceDto> GetSpotStream(string currencyPair)
            {
                return _priceStream;
            }
        }

        class WatchExecutionRepository : IExecutionRepository
        {
            public IObservable<IStale<ITrade>> ExecuteRequest(IExecutablePrice executablePrice, long notional, string dealtCurrency)
            {
                throw new NotImplementedException("Can't execute on LimitedNotificationTrader");
            }
        }

        private ILoggerFactory _loggerFactory;

        public void Initialize(IObservable<PriceDto> priceStream, ICurrencyPair currencyPair) 
        {
            _loggerFactory = new DebugLoggerFactory();
            var pricingServiceClient = new WatchPricingServiceClient(priceStream);
            var priceFactory = new PriceFactory(new WatchExecutionRepository(), new PriceLatencyRecorder());
            var priceRepository = new PriceRepository(pricingServiceClient, priceFactory, _loggerFactory);
            PriceStream = priceRepository.GetPriceStream(currencyPair);
        }

        public IObservable<IPrice> PriceStream
        {
            get;
            private set;
        }

        public void Dispose()
        {
//            _connectionProvider.Dispose();
        }
    }
}

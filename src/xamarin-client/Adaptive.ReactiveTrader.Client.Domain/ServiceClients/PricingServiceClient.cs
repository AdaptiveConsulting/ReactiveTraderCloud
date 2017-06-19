using Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using Adaptive.ReactiveTrader.Shared.Logging;
using System;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal class PricingServiceClient : IPricingServiceClient
    {
        private readonly ILog _log;
        private readonly WampServiceClient _serviceClient;

        public PricingServiceClient(WampServiceClient serviceClient, ILoggerFactory loggerFactory)
        {
            _serviceClient = serviceClient;
            _log = loggerFactory.Create(typeof(PricingServiceClient));
        }

        public IObservable<PriceDto> GetSpotStream(string currencyPair)
        {
            if (string.IsNullOrEmpty(currencyPair)) throw new ArgumentException("currencyPair");

            var request = new GetSpotStreamRequestDto { Symbol = currencyPair };

            _log.Info($"Subscribing to prices for ccy pair {currencyPair}");

            return _serviceClient.CreateStreamOperation<GetSpotStreamRequestDto, PriceDto>("getPriceUpdates", request);
        }
    }
}
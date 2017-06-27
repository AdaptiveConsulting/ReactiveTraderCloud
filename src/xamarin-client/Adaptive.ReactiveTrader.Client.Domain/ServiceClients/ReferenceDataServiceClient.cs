using Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp;
using Adaptive.ReactiveTrader.Shared.DTO;
using Adaptive.ReactiveTrader.Shared.DTO.ReferenceData;
using Adaptive.ReactiveTrader.Shared.Logging;
using System;
using System.Collections.Generic;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    class ReferenceDataServiceClient : IReferenceDataServiceClient
    {
        private readonly WampServiceClient _serviceClient;
        private readonly ILog _log;

        public ReferenceDataServiceClient(WampServiceClient serviceClient, ILoggerFactory loggerFactory)
        {
            _serviceClient = serviceClient;
            _log = loggerFactory.Create(typeof(ReferenceDataServiceClient));
        }

        public IObservable<IEnumerable<CurrencyPairUpdateDto>> GetCurrencyPairUpdatesStream()
        {
            return _serviceClient.CreateStreamOperation<NothingDto, CurrencyPairUpdatesDto>("getCurrencyPairUpdatesStream", new NothingDto())
                                 .Select(x => x.Updates)
                                 .Do(x => _log.InfoFormat("Subscribed to currency pairs and received {0} currency pairs.", x.Count));
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    class ReferenceDataRepository : IReferenceDataRepository
    {
        private readonly IReferenceDataServiceClient _referenceDataServiceClient;
        private readonly ICurrencyPairUpdateFactory _currencyPairUpdateFactory;

        public ReferenceDataRepository(IReferenceDataServiceClient referenceDataServiceClient, ICurrencyPairUpdateFactory currencyPairUpdateFactory)
        {
            _referenceDataServiceClient = referenceDataServiceClient;
            _currencyPairUpdateFactory = currencyPairUpdateFactory;
        }

        public IObservable<IEnumerable<ICurrencyPairUpdate>> GetCurrencyPairsStream()
        {
			// TODO This should really cache all ccy pairs.
            return Observable.Defer(() => _referenceDataServiceClient.GetCurrencyPairUpdatesStream())
                .Where(updates => updates.Any())
                .Select(updates => updates.Select(update => _currencyPairUpdateFactory.Create(update)))
                .Catch(Observable.Return(new ICurrencyPairUpdate[0]))  // if the stream errors (server disconnected), we push an empty list of ccy pairs  
                .Repeat()                                               // and resubscribe
                .Publish()
                .RefCount();
        }
    }
}

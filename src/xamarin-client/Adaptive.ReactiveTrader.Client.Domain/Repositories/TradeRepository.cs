using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.ServiceClients;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    class TradeRepository : ITradeRepository
    {
        private readonly IBlotterServiceClient _blotterServiceClient;
        private readonly ITradeFactory _tradeFactory;

        public TradeRepository(IBlotterServiceClient blotterServiceClient, ITradeFactory tradeFactory)
        {
            _blotterServiceClient = blotterServiceClient;
            _tradeFactory = tradeFactory;
        }

        public IObservable<IEnumerable<ITrade>> GetTradesStream()
        {
            return Observable.Defer(() => _blotterServiceClient.GetTradesStream())
                .Select(trades => trades.Select(_tradeFactory.Create))
                .Catch(Observable.Return(new ITrade[0]))
                .Repeat()
                .Publish()
                .RefCount();
        }
    }
}
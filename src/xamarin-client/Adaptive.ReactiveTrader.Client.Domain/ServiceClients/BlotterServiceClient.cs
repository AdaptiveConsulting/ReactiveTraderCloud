using Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp;
using Adaptive.ReactiveTrader.Shared.DTO;
using Adaptive.ReactiveTrader.Shared.DTO.Execution;
using Adaptive.ReactiveTrader.Shared.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal class BlotterServiceClient : IBlotterServiceClient
    {
        private readonly ILog _log;
        private readonly WampServiceClient _serviceClient;

        public BlotterServiceClient(WampServiceClient serviceClient, ILoggerFactory loggerFactory)
        {
            _serviceClient = serviceClient;
            _log = loggerFactory.Create(typeof(BlotterServiceClient));
        }

        public IObservable<IEnumerable<TradeDto>> GetTradesStream()
        {
            return _serviceClient.CreateStreamOperation<NothingDto, TradesDto>("getTradesStream", new NothingDto())
                .Where(x => x.IsStateOfTheWorld || x.Trades.All(t => t.Status != TradeStatusDto.Pending)) // A bit of a hack to get around the fact that old clients don't like the way the new server provides two responses for each trade
                .Select(x => x.Trades)
                .Do(x => _log.InfoFormat("Subscribed to trades and received {0} trades.", x.Count));
        }
    }
}
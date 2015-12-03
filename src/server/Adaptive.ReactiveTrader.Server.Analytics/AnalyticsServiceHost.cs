using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;
using Adaptive.ReactiveTrader.Server.Blotter;
using Adaptive.ReactiveTrader.Server.Common;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHost>();
        private readonly IAnalyticsService _service;
        private readonly IEventStoreConnection _eventStoreConnection;
        private readonly IBroker _broker;
        private readonly TradeCache _tradeCache;

        public AnalyticsServiceHost(
            IAnalyticsService service,
            IEventStoreConnection eventStoreConnection,
            IBroker broker, TradeCache tradeCache)
            : base(broker, "Analytics")
        {
            _service = service;
            _eventStoreConnection = eventStoreConnection;
            _broker = broker;
            _tradeCache = tradeCache;
        }

        public override async Task Start()
        {
            await base.Start();

            // listen to es for done trades
            _tradeCache.Initialize();

            _tradeCache.GetTrades()
                .SelectMany(t => t.Trades)
                .Where(t => t.Status == TradeStatusDto.Done &&
                            DateUtils.FromSerializationFormat(t.TradeDate) > DateTime.Today)
                .Subscribe(trade => _service.OnTrade(trade));

            // listen for price ticks
            //_broker.

            RegisterCall("getAnalytics", GetAnalyticsStream);
        }

        private async Task GetAnalyticsStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetAnalyticsStream from {0}", context.UserSession.Username);

            var endPoint = await _broker.GetPrivateEndPoint<PositionUpdatesDto>(message.ReplyTo);

            _service.GetAnalyticsStream()
                .TakeUntil(endPoint.TerminationSignal)
                .Subscribe(endPoint);
        }
    }
}
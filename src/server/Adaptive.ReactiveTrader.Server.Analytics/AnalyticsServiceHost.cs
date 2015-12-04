using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHost : ServiceHostBase
    {
        private new static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHost>();
        private readonly IAnalyticsService _service;
        private readonly IBroker _broker;
        private readonly TradeCache _tradeCache;
        private readonly CompositeDisposable _subscriptions;

        public AnalyticsServiceHost(IAnalyticsService service, IBroker broker, TradeCache tradeCache) : base(broker, "analytics")
        {
            _service = service;
            _broker = broker;
            _tradeCache = tradeCache;
            _subscriptions = new CompositeDisposable();

            RegisterCall("getAnalytics", GetAnalyticsStream);
            StartHeartBeat();

            ListenForPricesAndTrades();
        }

        private void ListenForPricesAndTrades()
        {
            Log.Info("Subscribing to prices topic...");

            _subscriptions.Add(_broker.SubscribeToTopic<SpotPriceDto>("prices")
                .Subscribe(p => _service.OnPrice(p)));

            Log.Info("Subscribed to prices topic");

            Log.Info("Subscribing to trades...");

            _subscriptions.Add(_tradeCache.GetTrades()
                .SelectMany(t => t.Trades)
                .Where(t => t.Status == TradeStatusDto.Done)
                .Subscribe(t => _service.OnTrade(t)));

            Log.Info("Subscribed to trades");
        }

        private async Task GetAnalyticsStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetAnalyticsStream from {0}", context.UserSession.Username);

            var endPoint = await _broker.GetPrivateEndPoint<PositionUpdatesDto>(message.ReplyTo);

            _subscriptions.Add(_service.GetAnalyticsStream()
                .TakeUntil(endPoint.TerminationSignal)
                .Subscribe(endPoint));
        }

        public override void Dispose()
        {
            base.Dispose();
            _subscriptions.Dispose();
        }
    }
}
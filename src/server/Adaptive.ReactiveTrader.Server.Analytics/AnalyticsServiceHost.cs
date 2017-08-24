using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Adaptive.ReactiveTrader.Server.Host;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHost : ServiceHostBase
    {
        //private new static readonly ILogger Log = Log.ForContext<AnalyticsServiceHost>();
        private readonly IBroker _broker;
        private readonly IAnalyticsService _service;
        private readonly CompositeDisposable _subscriptions;
        private readonly TradeCache _tradeCache;

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
            Log.Information("Subscribing to prices topic...");

            _subscriptions.Add(_broker.SubscribeToTopic<SpotPriceDto>("prices")
                                      .Subscribe(p => _service.OnPrice(p)));

            Log.Information("Subscribed to prices topic");

            Log.Information("Subscribing to trades...");

            _subscriptions.Add(_tradeCache.GetTrades()
                                          .SelectMany(t => t.Trades)
                                          .Where(t => t.Status == TradeStatusDto.Done)
                                          .Subscribe(t => _service.OnTrade(t)));

            Log.Information("Subscribed to trades");
        }

        private async Task GetAnalyticsStream(IRequestContext context, IMessage message)
        {
            Log.Debug("Received GetAnalyticsStream from {username}", context.UserSession.Username);

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
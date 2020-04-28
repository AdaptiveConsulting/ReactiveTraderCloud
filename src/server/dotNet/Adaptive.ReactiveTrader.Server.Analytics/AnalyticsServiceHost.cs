using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Common;
using Serilog;
using Serilog.Context;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHost : ServiceHostBase
    {
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
            using (LogContext.PushProperty("InstanceId", InstanceId))
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

                _subscriptions.Add(_tradeCache.GetTrades()
                                              .SkipWhile(t => t.IsStale)
                                              .Where(t => t.IsStale && t.IsStateOfTheWorld && t.Trades.Count == 0)
                                              .Subscribe(t => _service.OnReset()));

                Log.Information("Subscribed to trades");
            }
        }

        private Task GetAnalyticsStream(IRequestContext context, IMessage message)
        {
            using (LogContext.PushProperty("InstanceId", InstanceId))
            {
                Log.Debug("Received GetAnalyticsStream from {username}", context.Username);

                var endPoint = _broker.GetPrivateEndPoint<PositionUpdatesDto>(context.ReplyTo, context.CorrelationId);

                _subscriptions.Add(_service.GetAnalyticsStream()
                                           .TakeUntil(endPoint.TerminationSignal)
                                           .Subscribe(endPoint));

                return Task.CompletedTask;
            }
        }

        public override void Dispose()
        {
            base.Dispose();
            _subscriptions.Dispose();
        }
    }
}

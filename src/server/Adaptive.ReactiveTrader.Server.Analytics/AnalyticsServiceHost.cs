using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHost>();
        private readonly IAnalyticsService _service;
        private readonly IBroker _broker;
        private CompositeDisposable _subscriptions;

        public AnalyticsServiceHost(IAnalyticsService service, IBroker broker) : base(broker, "analytics")
        {
            _service = service;
            _broker = broker;
            _subscriptions = new CompositeDisposable();

            RegisterCall("getAnalytics", GetAnalyticsStream);
            StartHeartBeat();

            ListenForPrices();
        }

        private void ListenForPrices()
        {
            Log.Info("Subscribing to prices topic...");

            _subscriptions.Add(_broker.SubscribeToTopic<object>("prices")
                .Subscribe(p =>
                {
                    Log.InfoFormat("prices: {0}", p);
                }));

            Log.Info("Subscribed to prices topic");
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
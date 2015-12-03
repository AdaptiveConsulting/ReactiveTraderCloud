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

        public AnalyticsServiceHost(IAnalyticsService service, IBroker broker) : base(broker, "Analytics")
        {
            _service = service;
            _broker = broker;
        }

        public override async Task Start()
        {
            await base.Start();

            // listen to es for done trades

            // listen for price ticks

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
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingServiceHost : ServiceHostBase
    {
        protected new static readonly ILog Log = LogManager.GetLogger<PricingServiceHost>();

        private readonly IPricingService _service;
        private readonly IBroker _broker;

        public PricingServiceHost(IPricingService service, IBroker broker) :base( broker, "pricing")
        {
            _service = service;
            _broker = broker;

            RegisterCall("getPriceUpdates", GetCurrencyPairUpdatesStream);
            StartHeartBeat();
        }
        
        public async Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("{1} Received GetCurrencyPairUpdatesStream from [{0}]",
                context.UserSession.Username ?? "Unknown User", this);

            var spotStreamRequest =
                JsonConvert.DeserializeObject<GetSpotStreamRequestDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var endpoint = await _broker.GetPrivateEndPoint<SpotPriceDto>(replyTo);

            _service.GetPriceUpdates(context, spotStreamRequest)
                .TakeUntil(endpoint.TerminationSignal)
                .Subscribe(endpoint);
        }
    }
}
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingServiceHost : ServiceHostBase
    {
        protected new static readonly ILog Log = LogManager.GetLogger<PricingServiceHost>();
        private readonly IBroker _broker;
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        private readonly IPricingService _service;

        public PricingServiceHost(IPricingService service, IBroker broker) : base(broker, "pricing")
        {
            _service = service;
            _broker = broker;

            RegisterCall("getPriceUpdates", GetPriceUpdates);
            StartHeartBeat();
            StartPricePublisher();
        }

        private void StartPricePublisher()
        {
            var priceTrunkStream = _service.GetAllPriceUpdates(); // TODO dispose this when service host goes down
            var priceTrunk = new PricePublisher(priceTrunkStream, _broker);
            priceTrunk.Start().Wait();
        }

        public async Task GetPriceUpdates(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("{0} Received GetPriceUpdates from [{1}] for replyTo {2}",
                            this,
                            context.UserSession.Username ?? "Unknown User",
                            message.ReplyTo);

            var spotStreamRequest = JsonConvert.DeserializeObject<GetSpotStreamRequestDto>(Encoding.UTF8.GetString(message.Payload));

            var replyTo = message.ReplyTo;

            var endpoint = await _broker.GetPrivateEndPoint<SpotPriceDto>(replyTo);

            var disposable = _service.GetPriceUpdates(context, spotStreamRequest)
                                     .TakeUntil(endpoint.TerminationSignal)
                                     .Subscribe(endpoint);

            _cleanup.Add(disposable);
        }

        public override void Dispose()
        {
            _cleanup.Dispose();

            base.Dispose();
        }
    }
}
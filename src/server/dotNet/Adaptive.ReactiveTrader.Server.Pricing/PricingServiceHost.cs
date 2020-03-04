using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Newtonsoft.Json;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingServiceHost : ServiceHostBase
    {
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
            priceTrunk.Start();
        }

        public Task GetPriceUpdates(IRequestContext context, IMessage message)
        {
            Log.Debug("{host} Received GetPriceUpdates from [{user}] for replyTo {replyTo}",
                            this,
                            context.Username ?? "Unknown User",
                            context.ReplyTo);

            var spotStreamRequest = JsonConvert.DeserializeObject<GetSpotStreamRequestDto>(Encoding.UTF8.GetString(message.Payload));

            var replyTo = context.ReplyTo;

            var endpoint = _broker.GetPrivateEndPoint<SpotPriceDto>(replyTo, context.CorrelationId);

            var disposable = _service.GetPriceUpdates(context, spotStreamRequest)
                                     .TakeUntil(endpoint.TerminationSignal)
                                     .Subscribe(endpoint);

            _cleanup.Add(disposable);

            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _cleanup.Dispose();

            base.Dispose();
        }
    }
}

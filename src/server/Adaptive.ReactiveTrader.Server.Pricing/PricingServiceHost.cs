using System;
using System.Reactive.Disposables;
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

            RegisterCall("getPriceUpdates", GetPriceUpdates);
            StartHeartBeat();
            StartPricePublisher();
        }

        private void StartPricePublisher()
        {
            var priceTrunkStream = _service.GetAllPriceUpdates(); // TODO dispose this when service host goes down
            var priceTrunk = new PriceTrunk(priceTrunkStream, _broker);
            priceTrunk.Start().Wait();
        }

        public async Task GetPriceUpdates(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("{1} Received GetPriceUpdates from [{0}]",
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

    internal class PriceTrunk : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PriceTrunk>();

        private readonly IBroker _broker;
        private readonly IObservable<SpotPriceDto> _priceStream; 
        private IDisposable _disp = Disposable.Empty;

        public PriceTrunk(IObservable<SpotPriceDto> priceStream, IBroker broker)
        {
            _priceStream = priceStream;
            _broker = broker;
        }

        public void Dispose()
        {
            _disp.Dispose();
            Log.InfoFormat("Stopped price publishing to 'prices'");
        }

        public async Task Start()
        {
            var endpoint = await _broker.GetPublicEndPoint<SpotPriceDto>("prices");

            _disp = _priceStream.
                Select(o =>
                {
                    return o;
                })
                .Subscribe(endpoint);

            Log.InfoFormat("Started price publishing to 'prices'");
        }
    }
}
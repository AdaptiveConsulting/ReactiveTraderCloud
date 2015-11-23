using System;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public class PricingServiceHost : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<PricingServiceHost>();
        private readonly IPricingService _service;
        private readonly IBroker _broker;

        public PricingServiceHost(IPricingService service, IBroker broker)
        {
            _service = service;
            _broker = broker;
        }

        public async Task Start()
        {
            await _broker.RegisterCall("pricing.getPriceUpdates", GetCurrencyPairUpdatesStream);
            Console.WriteLine("procedure pricing.getPriceUpdates() registered");
        }

        public void GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}", context.UserSession.Username);

            var payload = JsonConvert.DeserializeObject<GetSpotStreamRequestDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var responseChannel = _broker.CreateChannelAsync<SpotPriceDto>(replyTo).Result;
            _service.GetPriceUpdates(context, payload, responseChannel);
        }

        public void Dispose()
        {
            
        }
    }
}
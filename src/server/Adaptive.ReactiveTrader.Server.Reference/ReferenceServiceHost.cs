using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class ReferenceServiceHost
    {
        private readonly IReferenceService _referenceService;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService referenceService, IBroker broker)
        {
            _referenceService = referenceService;
            _broker = broker;
        }

        public void GetCurrencyPairUpdatesStream(Message message)
        {
            var payload = JsonConvert.DeserializeObject<NothingDto>(message.Payload.ToString());

            var requestContext = new RequestContext
            {
                RequestMessage = message,
                UserSession = new UserSession
                {
                    Username = "Unknown"
                }
            };

            var replyTo = message.ReplyTo;

            var responseChannel = _broker.CreateChannelAsync<CurrencyPairUpdatesDto>(replyTo).Result;
            // todo maintain list of clients
            _referenceService.GetCurrencyPairUpdatesStream(requestContext, payload, responseChannel);
        }

        public void Start()
        {
            _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }
    }
}
using System.Text;
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

        public void GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var responseChannel = _broker.CreateChannelAsync<CurrencyPairUpdatesDto>(replyTo).Result;
            _referenceService.GetCurrencyPairUpdatesStream(context, payload, responseChannel);
        }

        public void Start()
        {
            _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }
    }
}
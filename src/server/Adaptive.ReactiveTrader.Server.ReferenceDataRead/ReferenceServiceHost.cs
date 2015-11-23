using System;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.ReferenceData;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceServiceHost : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceServiceHost>();
        private readonly IReferenceService _referenceService;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService referenceService, IBroker broker)
        {
            _referenceService = referenceService;
            _broker = broker;
        }

        public void GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}", context.UserSession.Username);

            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var responseChannel = _broker.CreateChannelAsync<CurrencyPairUpdatesDto>(replyTo).Result;
            _referenceService.GetCurrencyPairUpdatesStream(context, payload, responseChannel);
        }

        public async Task Start()
        {
            await _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }

        public void Dispose()
        {
            Console.WriteLine("Killing ReferenceRead ServiceHost");
        }
    }
}
using System;
using System.Text;
using System.Threading.Tasks;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceServiceHost : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceServiceHost>();
        private readonly IReferenceService _service;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService service, IBroker broker)
        {
            _service = service;
            _broker = broker;
        }

        public async Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}", context.UserSession.Username);

            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var privateEndpoint = await _broker.GetEndPoint<CurrencyPairUpdatesDto>(replyTo);

            _service.GetCurrencyPairUpdatesStream(context, payload)
                .TakeUntil(privateEndpoint.TerminationSignal)
                .Subscribe(privateEndpoint.PushMessage, privateEndpoint.PushError, privateEndpoint.PushComplete);
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
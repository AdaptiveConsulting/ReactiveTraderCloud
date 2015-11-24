using System;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceServiceHost : ServiceHostBase
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceServiceHost>();
        private readonly IReferenceService _service;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService service, IBroker broker) : base(broker, "ref")
        {
            _service = service;
            _broker = broker;
        }

        public async Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}", context.UserSession.Username);

            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var endPoint = await _broker.GetPrivateEndPoint<CurrencyPairUpdatesDto>(replyTo);

            _service.GetCurrencyPairUpdatesStream(context, payload)
                .TakeUntil(endPoint.TerminationSignal)
                .Subscribe(endPoint);
        }

        public override async Task Start()
        {
            await base.Start();
            await _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }

        public override void Dispose()
        {
            Console.WriteLine("Killing ReferenceRead ServiceHost");
            base.Dispose();
        }
    }
}
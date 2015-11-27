using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<ReferenceServiceHost>();
        private readonly IReferenceService _service;
        private readonly IBroker _broker;

        public ReferenceServiceHost(IReferenceService service, IBroker broker) : base(broker, "ref")
        {
            _service = service;
            _broker = broker;
        }

        public override async Task Start()
        {
            await base.Start();
            await _broker.RegisterCall("reference.getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }

        private async Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}", context.UserSession.Username ?? "<UNKNOWN USER>");

            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var endPoint = await _broker.GetPrivateEndPoint<CurrencyPairUpdatesDto>(replyTo);

            _service.GetCurrencyPairUpdatesStream(context, payload)
                .TakeUntil(endPoint.TerminationSignal)
                .Subscribe(endPoint);
        }

        public override void Dispose()
        {
            Log.Info("Dispose()");
            base.Dispose();
        }
    }
}
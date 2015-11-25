using System.Reactive.Linq;
using System.Text;
using System.Threading;
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

        public ReferenceServiceHost(IReferenceService service, IBroker broker) : base(broker, "reference")
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

            Interlocked.Increment(ref _clients);

            _service.GetCurrencyPairUpdatesStream(context, payload)
                .TakeUntil(endPoint.TerminationSignal).Finally(() => Interlocked.Decrement(ref _clients))
                .Subscribe(endPoint);
        }

        private int _clients;

        public override double GetLoad()
        {
            return _clients/100;
        }

        public override async Task Start()
        {
            await base.Start();
            RegisterCall("getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
        }

        public override void Dispose()
        {
            Log.Info("Dispose()");
            base.Dispose();
        }
    }
}
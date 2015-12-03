using System;
using System.Threading;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using Newtonsoft.Json;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceReadServiceHost : ServiceHostBase
    {
        private new static readonly ILog Log = LogManager.GetLogger<ReferenceReadServiceHost>();
        private readonly IReferenceService _service;
        private readonly IBroker _broker;
        private int _clients;
        private IDisposable _subscription;

        public ReferenceReadServiceHost(IReferenceService service, IBroker broker) : base(broker, "reference")
        {
            _service = service;
            _broker = broker;

            RegisterCall("getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
            StartHeartBeat();
        }

        private async Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetCurrencyPairUpdatesStream from {0}",
                context.UserSession.Username ?? "<UNKNOWN USER>");

            var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
            var replyTo = message.ReplyTo;

            var endPoint = await _broker.GetPrivateEndPoint<CurrencyPairUpdatesDto>(replyTo);

            Interlocked.Increment(ref _clients);

            _subscription = _service.GetCurrencyPairUpdatesStream(context, payload)
                                    .Do(o => { Log.DebugFormat("Sending currency pair update to {0}", replyTo); })
                                    .TakeUntil(endPoint.TerminationSignal).Finally(() => Interlocked.Decrement(ref _clients))
                                    .Finally(() => { Log.DebugFormat("Tidying up subscripting.", replyTo); })
                                    .Subscribe(endPoint);
        }

        public override double GetLoad()
        {
            return _clients/100d;
        }

        public override void Dispose()
        {
            base.Dispose();
            _subscription.Dispose();
        }
    }
}
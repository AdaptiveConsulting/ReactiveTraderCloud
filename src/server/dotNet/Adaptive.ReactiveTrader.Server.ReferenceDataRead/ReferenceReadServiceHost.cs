using System;
using System.Reactive.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Newtonsoft.Json;
using Serilog;
using Serilog.Context;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceReadServiceHost : ServiceHostBase
    {
        private readonly IBroker _broker;
        private readonly IReferenceService _service;
        private int _clients;
        private IDisposable _subscription;

        public ReferenceReadServiceHost(IReferenceService service, IBroker broker) : base(broker, "reference")
        {
            _service = service;
            _broker = broker;

            RegisterCall("getCurrencyPairUpdatesStream", GetCurrencyPairUpdatesStream);
            StartHeartBeat();
        }

        private Task GetCurrencyPairUpdatesStream(IRequestContext context, IMessage message)
        {
            using (LogContext.PushProperty("InstanceId", InstanceId))
            {
                Log.Debug("Received GetCurrencyPairUpdatesStream from {}",
                            context.Username ?? "<UNKNOWN USER>");

                var payload = JsonConvert.DeserializeObject<NothingDto>(Encoding.UTF8.GetString(message.Payload));
                var replyTo = context.ReplyTo;

                var endPoint = _broker.GetPrivateEndPoint<CurrencyPairUpdatesDto>(replyTo, context.CorrelationId);

                Interlocked.Increment(ref _clients);

                _subscription = _service.GetCurrencyPairUpdatesStream(context, payload)
                                        .Do(
                                            o =>
                                            {
                                                Log.Debug(
                                                    $"Sending currency pair update to {replyTo}. Count: {o.Updates.Count}. IsStateOfTheWorld: {o.IsStateOfTheWorld}. IsStale: {o.IsStale}");
                                            })
                                        .TakeUntil(endPoint.TerminationSignal).Finally(() => Interlocked.Decrement(ref _clients))
                                        .Finally(() => { Log.Debug("Tidying up subscription from {replyTo}.", replyTo); })
                                        .Subscribe(endPoint);
                return Task.CompletedTask;
            }
        }

        public override double GetLoad()
        {
            return _clients/100d;
        }

        public override void Dispose()
        {
            base.Dispose();
            _subscription?.Dispose();
        }
    }
}

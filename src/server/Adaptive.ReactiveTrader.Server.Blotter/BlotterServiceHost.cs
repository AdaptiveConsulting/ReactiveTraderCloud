using System;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHost : ServiceHostBase
    {
        //private new static readonly ILogger Log = Log.ForContext<BlotterServiceHost>();
        private readonly IBroker _broker;
        private readonly IBlotterService _service;
        private IDisposable _subscription;

        public BlotterServiceHost(IBlotterService service, IBroker broker) : base(broker, "blotter")
        {
            _service = service;
            _broker = broker;

            RegisterCall("getTradesStream", GetTradesStream);
            StartHeartBeat();
        }

        private async Task GetTradesStream(IRequestContext context, IMessage message)
        {
            Log.Debug("Received GetTradesStream from {username}", context.UserSession.Username ?? "<UNKNOWN USER>");
            var replyTo = message.ReplyTo;

            var endPoint = await _broker.GetPrivateEndPoint<TradesDto>(replyTo);

            _subscription = _service.GetTradesStream()
                                    .Do(
                                        o =>
                                        {
                                            Log.Debug(
                                                $"Sending trades update to {replyTo}. Count: {o.Trades.Count}. IsStateOfTheWorld: {o.IsStateOfTheWorld}. IsStale: {o.IsStale}");
                                        })
                                    .TakeUntil(endPoint.TerminationSignal)
                                    .Finally(() => { Log.Debug("Tidying up subscription from {replyTo}.", replyTo); })
                                    .Subscribe(endPoint);
        }

        public override void Dispose()
        {
            base.Dispose();
            _subscription?.Dispose();
        }
    }
}
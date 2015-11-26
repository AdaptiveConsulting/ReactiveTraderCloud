using System;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHost : ServiceHostBase
    {
        private static readonly ILog Log = LogManager.GetLogger<BlotterServiceHost>();
        private readonly IBlotterService _service;
        private readonly IBroker _broker;
        private IDisposable _disposable;

        public BlotterServiceHost(IBlotterService service, IBroker broker) : base(broker, "blotter")
        {
            _service = service;
            _broker = broker;
        }

        public override async Task Start()
        {
            await base.Start();
            await _broker.RegisterCall("blotter.getTradesStream", GetTradesStream);
        }

        private async Task GetTradesStream(IRequestContext context, IMessage message)
        {
            Log.DebugFormat("Received GetTradesStream from {0}", context.UserSession.Username);

            var endPoint = await _broker.GetPrivateEndPoint<TradesDto>(message.ReplyTo);

            _disposable = _service.GetTradesStream()
                .TakeUntil(endPoint.TerminationSignal)
                .Subscribe(endPoint);
        }

        public override void Dispose()
        {
            _disposable.Dispose();
            base.Dispose();
        }
    }
}

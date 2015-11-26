using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHost : ServiceHostBase
    {
        public BlotterServiceHost(IBlotterService service, IBroker broker) : base(broker, "blotter")
        {

        }
    }
}

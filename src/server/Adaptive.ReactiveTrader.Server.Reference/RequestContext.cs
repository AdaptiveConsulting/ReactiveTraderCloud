using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class RequestContext
    {
        public Message RequestMessage { get; set; }
        public UserSession UserSession { get; set; }
    }
}
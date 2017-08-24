namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public class RequestContext : IRequestContext
    {
        public RequestContext(IMessage requestMessage, IUserSession userSession)
        {
            RequestMessage = requestMessage;
            UserSession = userSession;
        }

        public IMessage RequestMessage { get; }
        public IUserSession UserSession { get; }
    }
}
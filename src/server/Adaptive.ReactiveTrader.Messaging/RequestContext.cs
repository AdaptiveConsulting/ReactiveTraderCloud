namespace Adaptive.ReactiveTrader.Messaging
{
    internal class RequestContext : IRequestContext
    {
        public IMessage RequestMessage { get; }
        public IUserSession UserSession { get; }

        public RequestContext(IMessage requestMessage, IUserSession userSession)
        {
            RequestMessage = requestMessage;
            UserSession = userSession;
        }
    }
}
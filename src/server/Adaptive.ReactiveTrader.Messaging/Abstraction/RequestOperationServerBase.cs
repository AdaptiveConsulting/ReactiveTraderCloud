using Serilog;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public abstract class RequestOperationServerBase
    {
        //protected static readonly ILogger Log = Log.ForContext<RequestOperationServerBase>();

        protected RequestOperationServerBase(IUserSessionCache userSessionCache, bool isSessionRequired)
        {
            UserSessionCache = userSessionCache;
            IsSessionRequired = isSessionRequired;
        }

        protected IUserSessionCache UserSessionCache { get; }
        protected bool IsSessionRequired { get; }

        protected IRequestContext CreateRequestContext(IMessage requestMessage)
        {
            var sessionId = requestMessage.SessionId;
            IUserSession userSession;
            if (!IsSessionRequired)
            {
                userSession = null;
            }
            else if (sessionId == null || !UserSessionCache.TryGetSession(sessionId, out userSession))
            {
                Log.Warning("Unable to find user session for ID: {sessionId}", sessionId);
                return null;
            }
            return new RequestContext(requestMessage, userSession);
        }
    }
}
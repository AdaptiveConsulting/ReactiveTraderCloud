using Common.Logging;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class RequestOperationServerBase
    {
        protected static readonly ILog Log = LogManager.GetLogger<RequestOperationServerBase>();
        protected IUserSessionCache UserSessionCache { get; private set; }
        protected bool IsSessionRequired { get; private set; }

        protected RequestOperationServerBase(IUserSessionCache userSessionCache, bool isSessionRequired)
        {
            UserSessionCache = userSessionCache;
            IsSessionRequired = isSessionRequired;
        }

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
                Log.Warn("Unable to find user session for ID: " + sessionId);
                return null;
            }
            return new RequestContext(requestMessage, userSession);
        }
    }
}
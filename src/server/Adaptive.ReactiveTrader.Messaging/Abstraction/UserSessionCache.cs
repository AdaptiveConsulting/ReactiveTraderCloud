using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public class UserSessionCache : IUserSessionCache
    {
        public TimeSpan TimeToLive { get; }

        public bool TryGetSession(string sessionId, out IUserSession session)
        {
            throw new NotImplementedException();
        }

        public bool TryEstablish(IUserSession session)
        {
            throw new NotImplementedException();
        }

        public bool TryRenew(string sessionId)
        {
            throw new NotImplementedException();
        }

        public bool TryDestroy(string sessionId, out IUserSession userSession)
        {
            throw new NotImplementedException();
        }

        public void Clear()
        {
            throw new NotImplementedException();
        }

        public IDisposable Subscribe(IUserSessionHandler userSessionHandler)
        {
            throw new NotImplementedException();
        }

        public IDisposable Subscribe(string sessionId, IUserSessionHandler userSessionHandler)
        {
            throw new NotImplementedException();
        }
    }
}
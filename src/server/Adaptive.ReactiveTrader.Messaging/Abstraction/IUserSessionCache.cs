using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IUserSessionCache
    {
        TimeSpan TimeToLive { get; }
        bool TryGetSession(string sessionId, out IUserSession session);
        bool TryEstablish(IUserSession session);
        bool TryRenew(string sessionId);
        bool TryDestroy(string sessionId, out IUserSession userSession);
        void Clear();
        IDisposable Subscribe(IUserSessionHandler userSessionHandler);
        IDisposable Subscribe(string sessionId, IUserSessionHandler userSessionHandler);
    }
}
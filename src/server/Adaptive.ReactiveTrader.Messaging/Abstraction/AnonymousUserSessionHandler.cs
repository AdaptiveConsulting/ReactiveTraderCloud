using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    internal class AnonymousUserSessionHandler : IUserSessionHandler
    {
        private readonly Action<IUserSession> _onDestroyed;
        private readonly Action<IUserSession> _onEstablished;

        public AnonymousUserSessionHandler(Action<IUserSession> onEstablished, Action<IUserSession> onDestroyed)
        {
            _onEstablished = onEstablished;
            _onDestroyed = onDestroyed;
        }

        public void OnEstablished(IUserSession userSession)
        {
            _onEstablished(userSession);
        }

        public void OnDestroyed(IUserSession userSession)
        {
            _onDestroyed(userSession);
        }
    }
}
using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class AnonymousUserSessionHandler : IUserSessionHandler
    {
        private readonly Action<IUserSession> _onEstabilished;
        private readonly Action<IUserSession> _onDestroyed;

        public AnonymousUserSessionHandler(Action<IUserSession> onEstabilished, Action<IUserSession> onDestroyed)
        {
            _onEstabilished = onEstabilished;
            _onDestroyed = onDestroyed;
        }

        public void OnEstablished(IUserSession userSession)
        {
            _onEstabilished(userSession);
        }

        public void OnDestroyed(IUserSession userSession)
        {
            _onDestroyed(userSession);
        }
    }
}
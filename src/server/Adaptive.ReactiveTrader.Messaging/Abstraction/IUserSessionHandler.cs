namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IUserSessionHandler
    {
        void OnEstablished(IUserSession userSession);
        void OnDestroyed(IUserSession userSession);
    }
}
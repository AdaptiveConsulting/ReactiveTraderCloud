namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IUserSessionHandler
    {
        void OnEstablished(IUserSession userSession);
        void OnDestroyed(IUserSession userSession);
    }
}
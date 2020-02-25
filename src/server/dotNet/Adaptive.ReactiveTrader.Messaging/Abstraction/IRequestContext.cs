namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IRequestContext
    {
        IMessage RequestMessage { get; }
        IUserSession UserSession { get; }
    }
}
namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IRequestContext
    {
        IMessage RequestMessage { get; }
        IUserSession UserSession { get; }
    }
}
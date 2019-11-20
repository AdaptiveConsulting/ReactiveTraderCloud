namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IRequestContext
    {
        string ReplyTo { get; }

        string CorrelationId { get; }
        string Username { get; }
        IMessage RequestMessage { get; }
    }
}
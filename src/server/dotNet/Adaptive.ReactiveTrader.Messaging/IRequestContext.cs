namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IRequestContext
    {
        string ReplyTo { get; }

        string CorrelationId { get; }
        string Username { get; }
        IMessage RequestMessage { get; }
    }
}

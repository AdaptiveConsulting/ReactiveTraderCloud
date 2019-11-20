namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IMessage
    {
        byte[] Payload { get; }
        string SessionId { get; }
    }
}
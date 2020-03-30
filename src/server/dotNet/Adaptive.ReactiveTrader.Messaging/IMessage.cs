namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IMessage
    {
        byte[] Payload { get; }
    }
}

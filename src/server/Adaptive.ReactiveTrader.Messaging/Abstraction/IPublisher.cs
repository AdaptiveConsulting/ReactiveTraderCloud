namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IPublisher
    {
        void Publish(IMessage message);
        void Publish(IMessage message, ITransientDestination subDestination);
    }
}
namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IPublisher
    {
        void Publish(IMessage message);
        void Publish(IMessage message, ITransientDestination subDestination);
    }
}
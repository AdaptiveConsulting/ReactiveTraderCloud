namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public interface IEventHandler
    {
    }

    public interface IEventHandler<in TEvent> : IEventHandler
    {
        void Handle(TEvent @event);
    }
}
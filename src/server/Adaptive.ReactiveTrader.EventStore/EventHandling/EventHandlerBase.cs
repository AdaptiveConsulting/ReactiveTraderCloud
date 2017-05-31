namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public abstract class EventHandlerBase<TEvent> : IEventHandler<TEvent>
    {
        public abstract void Handle(TEvent @event);
    }
}
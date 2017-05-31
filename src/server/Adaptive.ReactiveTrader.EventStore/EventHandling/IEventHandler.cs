using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public interface IEventHandler
    {
    }

    public interface IEventHandler<in TEvent> : IEventHandler
    {
        Task Handle(TEvent @event);
    }
}
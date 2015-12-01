using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public interface IAggregate
    {
        int Version { get; }
        void ApplyEvent(object @event);
        ICollection<object> GetPendingEvents();
        void ClearPendingEvents();
    }
}
using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public interface IAggregate
    {
        object Identifier { get; }
        int Version { get; }
        void ApplyEvent(object @event);
        ICollection<object> GetPendingEvents();
        void ClearPendingEvents();
    }
}
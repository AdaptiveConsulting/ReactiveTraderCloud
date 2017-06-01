using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public interface IAggregate
    {
        string StreamPrefix { get; }
        string Identifier { get; }
        int Version { get; }
        void ApplyEvent(object @event);
        ICollection<object> GetPendingEvents();
        void ClearPendingEvents();
    }
}
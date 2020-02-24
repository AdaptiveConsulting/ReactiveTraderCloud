using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public abstract class AggregateBase : IAggregate
    {
        private readonly List<object> _pendingEvents = new List<object>();

        public abstract object Identifier { get; }
        public int Version { get; private set; } = -1;

        void IAggregate.ApplyEvent(object @event)
        {
            ((dynamic) this).Apply((dynamic) @event);
            Version++;
        }

        public ICollection<object> GetPendingEvents()
        {
            return _pendingEvents;
        }

        public void ClearPendingEvents()
        {
            _pendingEvents.Clear();
        }

        protected void RaiseEvent(object @event)
        {
            ((IAggregate) this).ApplyEvent(@event);
            _pendingEvents.Add(@event);
        }
    }
}
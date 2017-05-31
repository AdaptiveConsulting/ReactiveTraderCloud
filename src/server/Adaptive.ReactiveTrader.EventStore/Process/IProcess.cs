using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcess
    {
        string Id { get; }

        int Version { get; }

        void Transition(object @event);

        IEnumerable<object> GetUncommittedEvents();

        void ClearUncommittedEvents();

        IEnumerable<object> GetUndispatchedCommands();

        void ClearUndispatchedCommands();
    }
}
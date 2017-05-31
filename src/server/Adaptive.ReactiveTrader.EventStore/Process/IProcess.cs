using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcess
    {
        object Identifier { get; }

        int Version { get; }

        void Transition(object @event);

        IEnumerable<object> GetUncommittedEvents();

        IEnumerable<object> GetUndispatchedCommands();

        void ClearUncommittedEvents();

        void ClearUndispatchedCommands();
    }
}
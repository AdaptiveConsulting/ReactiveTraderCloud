using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcess
    {
        object Identifier { get; }
        int Version { get; }
        void Transition(object @event);
        IReadOnlyList<object> GetUncommittedEvents();
        IReadOnlyList<object> GetUndispatchedMessages();
        void ClearUncommittedEvents();
        void ClearUndispatchedMessages();
        Task DispatchMessages();
    }
}
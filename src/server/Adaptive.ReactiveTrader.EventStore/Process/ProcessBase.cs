using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public class ProcessBase : IProcess
    {
        public string Id { get; }

        public int Version { get; }

        public void Transition(object @event)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<object> GetUncommittedEvents()
        {
            throw new System.NotImplementedException();
        }

        public void ClearUncommittedEvents()
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<object> GetUndispatchedCommands()
        {
            throw new System.NotImplementedException();
        }

        public void ClearUndispatchedCommands()
        {
            throw new System.NotImplementedException();
        }
    }
}
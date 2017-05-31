using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public interface IEventDispatcher
    {
        Task<IDisposable> Start(string streamName, string groupName, IEnumerable<IEventHandler> eventHandlers);
    }
}
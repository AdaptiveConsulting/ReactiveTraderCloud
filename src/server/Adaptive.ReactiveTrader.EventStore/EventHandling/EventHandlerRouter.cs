using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.EventHandling
{
    public class EventHandlerRouter
    {
        private readonly Dictionary<Type, Func<object, Task>> _handlers = new Dictionary<Type, Func<object, Task>>();

        public void AddRoute<TEvent>(Func<TEvent, Task> handler)
        {
            _handlers.Add(typeof(TEvent), x => handler((TEvent)x));
        }

        public bool CanRoute(object @event) => _handlers.ContainsKey(@event.GetType());

        public Task Route(object @event)
        {
            Func<object, Task> handler;
            return _handlers.TryGetValue(@event.GetType(), out handler) ? handler(@event) : Task.CompletedTask;
        }
    }
}
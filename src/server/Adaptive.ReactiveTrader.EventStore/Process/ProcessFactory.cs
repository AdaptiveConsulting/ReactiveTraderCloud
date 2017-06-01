using System;
using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    // Ideally we'd have an IoC container like AutoFac, so we don't have to do all this.
    public class ProcessFactory : IProcessFactory
    {
        private readonly Dictionary<Type, Func<IProcess>> _resolvers = new Dictionary<Type, Func<IProcess>>();

        public T Create<T>() where T : IProcess, new()
        {
            Func<IProcess> resolver;
            if (_resolvers.TryGetValue(typeof(T), out resolver))
            {
                return (T) resolver();
            }

            return new T();
        }

        public void AddResolver<T>(Func<T> resolver) where T : IProcess
        {
            _resolvers.Add(typeof(T), () => resolver());
        }
    }
}
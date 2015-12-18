using System;
using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class EventTypeResolver
    {
        private readonly IDictionary<string, Type> _typeMap;

        public EventTypeResolver()
        {
            var ourAssemblies = AppDomain.CurrentDomain
                                         .GetAssemblies()
                                         .Where(x => x.FullName.StartsWith("Adaptive."));

            _typeMap = ourAssemblies.SelectMany(x => x.GetExportedTypes())
                                    .Where(x => x.Name.EndsWith("Event", StringComparison.InvariantCulture))
                                    .ToDictionary(x => x.Name);
        }

        public Type GetTypeForEventName(string name)
        {
            Type eventType;
            var strippedName = name.Replace(" ", string.Empty);
            if (!_typeMap.TryGetValue(strippedName, out eventType))
            {
                throw new ArgumentException($"Unable to find suitable type for event name {name}. Expected to find a type named {strippedName}Event");
            }

            return eventType;
        }
    }
}
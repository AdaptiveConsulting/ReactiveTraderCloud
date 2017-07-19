using System;
using System.Runtime.Serialization;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    [DataContract]
    public class AggregateNotFoundException : AggregateExceptionBase
    {
        public AggregateNotFoundException(object id, Type type) : base(id, type)
        {
        }

        public AggregateNotFoundException(object id, Type type, string message) : base(id, type, message)
        {
        }

        public AggregateNotFoundException(object id, Type type, string message, Exception innerException)
            : base(id, type, message, innerException)
        {
        }
    }
}
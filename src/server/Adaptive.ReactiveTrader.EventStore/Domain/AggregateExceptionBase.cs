using System;
using System.Runtime.Serialization;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    [DataContract]
    public abstract class AggregateExceptionBase : Exception
    {
        protected AggregateExceptionBase(object id, Type type)
        {
            Id = id;
            Type = type;
        }

        protected AggregateExceptionBase(object id, Type type, string message) : base(message)
        {
            Id = id;
            Type = type;
        }

        protected AggregateExceptionBase(object id, Type type, string message, Exception innerException)
            : base(message, innerException)
        {
            Id = id;
            Type = type;
        }

        public object Id { get; }

        public Type Type { get; }
    }
}
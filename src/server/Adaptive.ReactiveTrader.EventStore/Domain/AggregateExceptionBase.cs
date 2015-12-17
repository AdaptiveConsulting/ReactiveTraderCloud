using System;
using System.Runtime.Serialization;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    [Serializable]
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

        protected AggregateExceptionBase(SerializationInfo info, StreamingContext context) : base(info, context)
        {
            Id = info.GetValue(nameof(Id), typeof (object));
            Type = (Type) info.GetValue(nameof(Type), typeof (Type));
        }

        public object Id { get; }

        public Type Type { get; }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            if (info == null)
            {
                throw new ArgumentNullException(nameof(info));
            }

            info.AddValue(nameof(Id), Id);
            info.AddValue(nameof(Type), Type);

            base.GetObjectData(info, context);
        }
    }
}
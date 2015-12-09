using System;
using System.Runtime.Serialization;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    [Serializable]
    public class IdGenerationFailedException : Exception
    {
        public IdGenerationFailedException()
        {
        }

        public IdGenerationFailedException(string message) : base(message)
        {
        }

        public IdGenerationFailedException(string message, Exception inner) : base(message, inner)
        {
        }

        protected IdGenerationFailedException(
            SerializationInfo info,
            StreamingContext context) : base(info, context)
        {
        }
    }
}
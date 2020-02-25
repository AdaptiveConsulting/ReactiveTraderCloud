using System;
using System.Runtime.Serialization;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    [DataContract]
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
    }
}
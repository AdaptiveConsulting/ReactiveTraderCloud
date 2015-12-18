using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public class MessagingException : Exception
    {
        public MessagingException(string message)
            : base(message)
        {
        }

        public MessagingException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
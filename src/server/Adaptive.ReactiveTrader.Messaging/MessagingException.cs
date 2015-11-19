using System;

namespace Adaptive.ReactiveTrader.Messaging
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
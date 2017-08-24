using System;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class MessageFactory : IMessageFactory
    {
        public IMessage Create(byte[] payload, TimeSpan timeToLive)
        {
            throw new NotImplementedException();
        }

        public IMessage Create(TimeSpan timeToLive)
        {
            throw new NotImplementedException();
        }
    }
}
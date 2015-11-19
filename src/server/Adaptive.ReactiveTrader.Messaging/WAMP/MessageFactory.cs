using System;

namespace Adaptive.ReactiveTrader.Messaging
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
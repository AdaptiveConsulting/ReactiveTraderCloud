using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IMessageFactory
    {
        IMessage Create(byte[] payload, TimeSpan timeToLive);
        IMessage Create(TimeSpan timeToLive);
    }
}
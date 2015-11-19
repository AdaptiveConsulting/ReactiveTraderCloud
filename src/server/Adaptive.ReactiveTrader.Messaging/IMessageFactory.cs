using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IMessageFactory
    {
        IMessage Create(byte[] payload, TimeSpan timeToLive);
        IMessage Create(TimeSpan timeToLive);
    }
}
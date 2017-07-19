using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public class Publisher : IPublisher
    {
        public void Publish(IMessage message)
        {
            throw new NotImplementedException();
        }

        public void Publish(IMessage message, ITransientDestination subDestination)
        {
            throw new NotImplementedException();
        }
    }
}
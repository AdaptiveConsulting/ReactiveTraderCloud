using System;

namespace Adaptive.ReactiveTrader.Messaging
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
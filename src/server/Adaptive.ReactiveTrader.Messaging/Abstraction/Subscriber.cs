using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public class Subscriber : ISubscriber
    {
        public IDisposable Subscribe(MessageHandler messageHandler)
        {
            throw new NotImplementedException();
        }

        public IDisposable Subscribe(ISelectionExpression selectionExpression, MessageHandler messageHandler)
        {
            throw new NotImplementedException();
        }
    }
}
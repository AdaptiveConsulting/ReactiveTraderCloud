using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface ISubscriber
    {
        IDisposable Subscribe(MessageHandler messageHandler);
        IDisposable Subscribe(ISelectionExpression selectionExpression, MessageHandler messageHandler);
    }
}
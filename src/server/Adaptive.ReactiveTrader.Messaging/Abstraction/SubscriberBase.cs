using System;
using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class SubscriberBase : ISubscriber
    {
        private IDisposable _underlying;
        private readonly ISet<MessageHandler> _handlers = new HashSet<MessageHandler>();
        private MessageHandler[] _handlersSnapshot;

        public IDisposable Subscribe(MessageHandler messageHandler)
        {
            lock (_handlers)
            {
                _handlers.Add(messageHandler);
                _handlersSnapshot = _handlers.ToArray();

                if (_underlying == null)
                {
                    _underlying = OnRegister(message =>
                    {
                        lock (_handlers)
                        {
                            foreach (var handler in _handlersSnapshot)
                            {
                                handler(message);
                            }
                        }
                    });
                }
            }
            return new AnonymousDisposable(() =>
            {
                lock (_handlers)
                {
                    _handlers.Remove(messageHandler);
                    _handlersSnapshot = _handlers.ToArray();
                    if (_handlers.Count == 0)
                    {
                        _underlying.Dispose();
                        _underlying = null;
                    }
                }
            });
        }

        public IDisposable Subscribe(ISelectionExpression selectionExpression, MessageHandler messageHandler)
        {
            // We could share the subscription here based on the selectionExpression. However, we'd need
            // to make ISelectionExpression and its sub types have structural comparison. It isn't
            // obvious that there will be any sharing.
            return OnRegister(selectionExpression, messageHandler);
        }

        protected abstract IDisposable OnRegister(MessageHandler messageHandler);

        protected abstract IDisposable OnRegister(ISelectionExpression selectionExpression,
            MessageHandler messageHandler);
    }
}
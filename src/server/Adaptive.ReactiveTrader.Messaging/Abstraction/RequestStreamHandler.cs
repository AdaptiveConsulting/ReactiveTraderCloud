using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public delegate IDisposable RequestStreamHandler<in TRequest, out TUpdate>(
        IRequestContext context, TRequest request, IStreamHandler<TUpdate> streamHandler);
}
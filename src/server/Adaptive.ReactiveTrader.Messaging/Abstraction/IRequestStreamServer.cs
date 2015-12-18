using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IRequestStreamServer<out TRequest, in TUpdate>
    {
        IDisposable Stream(RequestStreamHandler<TRequest, TUpdate> requestStreamHandler);
    }
}
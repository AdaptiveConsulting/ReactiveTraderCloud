using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IRequestStreamServer<out TRequest, in TUpdate>
    {
        IDisposable Stream(RequestStreamHandler<TRequest, TUpdate> requestStreamHandler);
    }
}
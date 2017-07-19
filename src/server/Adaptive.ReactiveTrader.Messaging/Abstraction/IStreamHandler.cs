using System;

namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface IStreamHandler<in TUpdate>
    {
        void OnUpdated(TUpdate update);
        void OnCompleted();
        void OnError(Exception error);
    }
}
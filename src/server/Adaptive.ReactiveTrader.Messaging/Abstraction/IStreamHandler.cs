using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IStreamHandler<in TUpdate>
    {
        void OnUpdated(TUpdate update);
        void OnCompleted();
        void OnError(Exception error);
    }
}
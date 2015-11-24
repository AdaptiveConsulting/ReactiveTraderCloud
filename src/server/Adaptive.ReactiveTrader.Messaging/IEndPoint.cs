using System;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IEndPoint<in T>
    {
        void PushMessage(T obj);
        void PushError(Exception ex);
    }
}
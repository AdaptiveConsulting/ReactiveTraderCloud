using System;
using System.Reactive;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IPrivateEndPoint<in T>
    {
        IObservable<Unit> TerminationSignal { get; }

        void PushMessage(T obj);
        void PushError(Exception ex);
        void PushComplete();
    }
}
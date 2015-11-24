using System;
using System.Reactive;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IPrivateEndPoint<in T> : IEndPoint<T>
    {
        IObservable<Unit> TerminationSignal { get; }
    }
}
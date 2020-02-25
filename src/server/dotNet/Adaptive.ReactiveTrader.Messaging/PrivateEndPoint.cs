using System;
using System.Reactive;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class PrivateEndPoint<T> : EndPoint<T>, IPrivateEndPoint<T>
    {
        public PrivateEndPoint(ISubject<T> subject, IObservable<Unit> breaker) : base(subject)
        {
            TerminationSignal = breaker;
        }

        public IObservable<Unit> TerminationSignal { get; }
    }
}
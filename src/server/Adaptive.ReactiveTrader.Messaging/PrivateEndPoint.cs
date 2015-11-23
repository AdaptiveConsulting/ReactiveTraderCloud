using System;
using System.Reactive;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class PrivateEndPoint<T> : IPrivateEndPoint<T>
    {
        private readonly ISubject<T> _subject;

        public PrivateEndPoint(ISubject<T> subject, IObservable<Unit> breaker)
        {
            _subject = subject;
            TerminationSignal = breaker;
        }

        public IObservable<Unit> TerminationSignal { get; }

        public void PushMessage(T obj)
        {
            _subject.OnNext(obj);
        }

        public void PushError(Exception ex)
        {
            _subject.OnError(ex);
        }

        public void PushComplete()
        {
        }
    }
}
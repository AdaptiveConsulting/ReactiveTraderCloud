using System;
using System.Reactive.Subjects;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class EndPoint<T> : IEndPoint<T>
    {
        private readonly ISubject<T> _subject;

        public EndPoint(ISubject<T> subject)
        {
            _subject = subject;
        }

        public void PushMessage(T obj)
        {
            _subject.OnNext(obj);
        }

        public void PushError(Exception ex)
        {
            _subject.OnError(ex);
        }
    }
}
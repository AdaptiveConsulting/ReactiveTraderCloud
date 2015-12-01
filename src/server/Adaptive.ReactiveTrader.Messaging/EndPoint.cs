using System;
using System.Net;
using System.Reactive.Subjects;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class EndPoint<T> : IEndPoint<T>
    {
        protected static readonly ILog Log = LogManager.GetLogger<EndPoint>();

        private readonly ISubject<T> _subject;

        public EndPoint(ISubject<T> subject)
        {
            _subject = subject;
        }

        public void PushMessage(T obj)
        {
            try
            {
                _subject.OnNext(obj);
            }
            catch (Exception e)
            {
                Log.Error("Could not send message", e);
            }
        }

        public void PushError(Exception ex)
        {
            _subject.OnError(ex);
        }
    }
}
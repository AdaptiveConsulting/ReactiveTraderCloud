using System;
using System.Net;
using System.Reactive.Subjects;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class EndPoint<T> : IEndPoint<T>
    {
        //protected static readonly ILogger Log = Log.ForContext<EndPoint>();

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
                Log.Error("Could not send message {message}", e.Message);
            }
        }

        public void PushError(Exception ex)
        {
            _subject.OnError(ex);
        }
    }
}
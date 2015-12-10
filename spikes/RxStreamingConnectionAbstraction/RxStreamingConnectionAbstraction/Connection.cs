using System;
using System.Collections.Generic;
using System.Reactive.Subjects;

namespace RxGroupBy
{
    public class Connection
    {
        private readonly Dictionary<Type, dynamic> _requestResponseSubjects = new Dictionary<Type, dynamic>();

        public Connection()
        {
            ServiceStatus = new Subject<ServiceStatus>();
        }

        public Subject<ServiceStatus> ServiceStatus { get; set; }

        public IObservable<TResponse> CreateRequestResponseOperation<TRequest, TResponse>(ServiceStatus serviceToUse, TRequest request)
        {
            var subject = GetOrAddResponseSubject<TResponse>();
            return subject;
        }

        public IObservable<TResponse> CreateStreamOperation<TResponse>(ServiceStatus serviceToUse)
        {
            var subject = GetOrAddResponseSubject<TResponse>();
            return subject;
        }

        public Subject<TResponseType> GetOrAddResponseSubject<TResponseType>()
        {
            dynamic subject;
            if (!_requestResponseSubjects.TryGetValue(typeof(TResponseType), out subject))
            {
                subject = new Subject<TResponseType>();
                _requestResponseSubjects.Add(typeof(TResponseType), subject);
            }
            return subject;
        }

        public void PushResposne<TResponse>(TResponse response)
        {
            var subject = GetOrAddResponseSubject<TResponse>();
            subject.OnNext(response);
        }
    }
}
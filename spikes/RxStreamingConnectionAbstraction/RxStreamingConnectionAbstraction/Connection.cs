using System;
using System.Collections.Generic;
using System.Reactive.Subjects;

namespace RxStreamingConnectionAbstraction
{
    public class Connection
    {
        private readonly Dictionary<string, dynamic> _requestResponseSubjects = new Dictionary<string, dynamic>();

        public Connection()
        {
            ConnectionStatus = new Subject<bool>();
        }

        public Subject<bool> ConnectionStatus { get; set; }

        public IObservable<TResponse> SubscribeToTopic<TResponse>(string topicName)
        {
            var subject = GetOrAddResponseSubject<TResponse>(topicName);
            return subject;
        }

        public IObservable<TResponse> SubscribeToTopic<TResponse>(string topicName, ServiceStatus serviceInstanceToUse)
        {
            var subject = GetOrAddResponseSubject<TResponse>(topicName);
            return subject;
        }

        public IObservable<TResponse> ExecuteRemoteCall<TRequest, TResponse>(string topicName, ServiceStatus serviceInstanceToUse, TRequest request)
        {
            var subject = GetOrAddResponseSubject<TResponse>(topicName);
            return subject;
        }

        public Subject<TResponseType> GetOrAddResponseSubject<TResponseType>(string topicName)
        {
            dynamic subject;
            if (!_requestResponseSubjects.TryGetValue(topicName, out subject))
            {
                subject = new Subject<TResponseType>();
                _requestResponseSubjects.Add(topicName, subject);
            }
            return subject;
        }

        public void PushResposne<TResponse>(string topicName, TResponse response)
        {
            var subject = GetOrAddResponseSubject<TResponse>(topicName);
            subject.OnNext(response);
        }
    }
}
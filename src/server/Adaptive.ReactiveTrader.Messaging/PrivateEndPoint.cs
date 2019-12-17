using System;
using System.Reactive;
using System.Reactive.Subjects;
using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class PrivateEndpoint<T> : IPrivateEndPoint<T>
    {
        private readonly IModel _channel;
        private readonly string _topic;
        private readonly string _correlationId;
        private readonly Subject<Unit> _subject;

        public PrivateEndpoint(IModel channel, string topic, string correlationId) 
        {
            _channel = channel;
            _topic = topic;
            _correlationId = correlationId;
            _subject = new Subject<Unit>();

            _channel.BasicReturn += OnChannelReturn;
            _channel.ModelShutdown += OnModelShutdown;
        }

        public void PushMessage(T obj)
        {
            try
            {
                var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
                var props = _channel.CreateBasicProperties();
                props.CorrelationId = _correlationId;
                _channel.BasicPublish(string.Empty, _topic, true, props, body);
            }
            catch (Exception e)
            {
                Log.Error("Could not send message {message}", e.Message);
            }
        }

        public void PushError(Exception ex)
        {
            throw new NotImplementedException(); // TODO
        }

        private void OnModelShutdown(object sender, ShutdownEventArgs e) => TearDown();
        private void OnChannelReturn(object sender, BasicReturnEventArgs e) => TearDown();
        private void TearDown()
        {
            _subject.OnNext(Unit.Default);
            _channel.BasicReturn -= OnChannelReturn;
            _channel.ModelShutdown -= OnModelShutdown;
        }

        public IObservable<Unit> TerminationSignal => _subject;
    }
}

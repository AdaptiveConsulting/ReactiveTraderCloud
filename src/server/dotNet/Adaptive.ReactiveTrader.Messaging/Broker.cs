using System;
using System.Reactive;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;
using Serilog.Events;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class Broker : IBroker
    {
        private readonly IModel _channel;

        public Broker(IModel channel)
        {
            _channel = channel;
            
        }
        public IDisposable RegisterCall(string procName, Func<IRequestContext, IMessage, Task> onMessage)
        {
            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information($"Registering call: [{procName}]");
            }

            return new RemoteSubscriptionRegistration(_channel, procName, onMessage);
        }

        public IDisposable RegisterCallResponse<TResponse>(string procName, Func<IRequestContext, IMessage, Task<TResponse>> onMessage)
        {
            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information($"Registering call: [{procName}]");
            }

            return new RemoteRequestRegistration<TResponse>(_channel, procName, onMessage);
        }

        public IPrivateEndPoint<T> GetPrivateEndPoint<T>(string replyTo, string correlationId)
        {
            return new PrivateEndpoint<T>(_channel, replyTo, correlationId);
        }

        public IEndPoint<T> GetPublicEndPoint<T>(string topic)
        {
            return new EndPoint<T>(_channel, topic);
        }

        public IObservable<T> SubscribeToTopic<T>(string topic)
        {
            _channel.ExchangeDeclare(topic, ExchangeType.Fanout);
            var queueName = _channel.QueueDeclare().QueueName;
            _channel.QueueBind(queue: queueName, exchange: topic, routingKey: string.Empty);

            var consumer = new EventingBasicConsumer(_channel);
            var observable = Observable.FromEventPattern<BasicDeliverEventArgs>(
                    x => consumer.Received += x,
                    x => consumer.Received -= x)
                .Select(GetJsonPayload<T>);
            _channel.BasicConsume(queueName, true, consumer);

            return observable;
        }

        private static TResult GetJsonPayload<TResult>(EventPattern<BasicDeliverEventArgs> arg)
        {
            var body = Encoding.UTF8.GetString(arg.EventArgs.Body);
            return JsonConvert.DeserializeObject<TResult>(body);
        }
    }
}

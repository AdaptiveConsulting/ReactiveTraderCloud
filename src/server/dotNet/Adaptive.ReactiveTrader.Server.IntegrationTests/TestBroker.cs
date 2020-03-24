using Adaptive.ReactiveTrader.Messaging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading;

namespace Adaptive.ReactiveTrader.Server.IntegrationTests
{
    public class TestBroker
    {
        private readonly IModel _channel;
        private readonly Broker _broker;

        public TestBroker()
        {
            IConnection connection = null;
            var connectionFactory = new ConnectionFactory { HostName = TestAddress.BrokerHost, Port = TestAddress.BrokerPort, AutomaticRecoveryEnabled = true };
            while (connection == null)
            {
                try
                {
                    connection = connectionFactory.CreateConnection();
                }
                catch (RabbitMQ.Client.Exceptions.BrokerUnreachableException)
                {
                    Thread.Sleep(1000);
                }
            }
            _channel = connection.CreateModel();
            _broker = new Broker(_channel);
        }

        public IObservable<T> SubscribeToTopic<T>(string topic)
        {
            return _broker.SubscribeToTopic<T>(topic);
        }

        internal void RpcCall<TResult, TPayload>(string methodName, TPayload payload, Action<TResult> callback)
        {
            var replyQueueName = _channel.QueueDeclare().QueueName;

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (_, args) =>
            {
                var body = Encoding.UTF8.GetString(args.Body);
                var result = JsonConvert.DeserializeObject<TResult>(body);
                callback(result);
            };

            _channel.BasicConsume(replyQueueName, true, consumer);
            

            dynamic dto = new
            {
                ReplyTo = replyQueueName,
                Payload = payload
            };
            var props = _channel.CreateBasicProperties();
            props.ReplyTo = replyQueueName;
            props.CorrelationId = Guid.NewGuid().ToString();
            var message = JsonConvert.SerializeObject(dto);
            _channel.BasicPublish(string.Empty, methodName, false, props, Encoding.UTF8.GetBytes(message));
        }
    }
}

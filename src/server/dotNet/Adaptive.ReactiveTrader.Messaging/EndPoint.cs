using System;
using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class EndPoint<T> : IEndPoint<T>
    {
        private readonly IModel _channel;
        private readonly string _topic;


        public EndPoint(IModel channel, string topic)
        {
            _channel = channel;
            _topic = topic;
            _channel.ExchangeDeclare(topic, ExchangeType.Fanout);
        }

        public void PushMessage(T obj)
        {
            try
            {
                var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj));
                _channel.BasicPublish(_topic, string.Empty, null, body);
            }
            catch (Exception e)
            {
                Log.Error("Could not send message {message}", e.Message);
            }
        }

        public void PushError(Exception ex)
        {
            throw new InvalidOperationException("", ex); //TODO: discuss implementing proper error propagation to UI
        }
    }
}

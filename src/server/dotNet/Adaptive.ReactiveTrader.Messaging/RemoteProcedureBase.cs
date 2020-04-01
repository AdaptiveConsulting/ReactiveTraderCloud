using System;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal abstract class RemoteProcedureBase : IDisposable
    {
        protected readonly IModel Channel;
        private readonly string _procName;
        private readonly string _consumerTag;

        protected RemoteProcedureBase(IModel channel, string procName)
        {
            Channel = channel;
            _procName = procName;
            Channel.QueueDeclare(
                queue: procName,
                durable: false,
                exclusive: false,
                autoDelete: true,
                arguments: null);
            Channel.BasicQos(0, 1, false);
            var consumer = new EventingBasicConsumer(Channel);
            consumer.Received += MessageReceived;
            _consumerTag = Channel.BasicConsume(procName, false, consumer);
        }

        protected abstract Task HandleMessage(RequestContext requestContext, IBasicProperties replyProperties);

        private async void MessageReceived(object sender, BasicDeliverEventArgs args)
        {
            try
            {
                var requestContext = DeserializeMessage(args.Body, args.BasicProperties);
                await HandleMessage(requestContext, args.BasicProperties);
                Channel.BasicAck(args.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Exception while processing RPC {procName}", _procName);
                Channel.BasicNack(args.DeliveryTag, false, requeue: false); // TODO: should we requeue?
            }
        }

        private static RequestContext DeserializeMessage(byte[] body, IBasicProperties props)
        {
            var request = Encoding.UTF8.GetString(body);
            var x = JsonConvert.DeserializeObject<MessageDto>(request);
            var payload = x.Payload.ToString();
            var message = new Message
            {
                ReplyTo = x.ReplyTo,
                Payload = Encoding.UTF8.GetBytes(payload)
            };

            var userContext = new RequestContext(message, x.Username, props.ReplyTo, props.CorrelationId);
            return userContext;
        }

        public void Dispose()
        {
            if (Channel.IsOpen)
            {
                Channel.BasicCancel(_consumerTag);
            }
        }
    }
}

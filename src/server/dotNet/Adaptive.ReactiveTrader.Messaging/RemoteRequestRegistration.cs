using System;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class RemoteRequestRegistration<TResponse> : RemoteProcedureBase
    {
        private readonly Func<IRequestContext, IMessage, Task<TResponse>> _messageHandler;

        public RemoteRequestRegistration(IModel channel, string procName, Func<IRequestContext, IMessage, Task<TResponse>> messageHandler) : base(channel, procName)
        {   
            _messageHandler = messageHandler;
        }

        protected override async Task HandleMessage(RequestContext requestContext, IBasicProperties requestProperties)
        {
            var result = await _messageHandler(requestContext, requestContext.RequestMessage);

            var replyProperties = CreateReplyProperties(requestProperties);
            var responseBytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(result));
            Channel.BasicPublish(
                exchange: string.Empty, 
                routingKey: requestProperties.ReplyTo,
                basicProperties: replyProperties, 
                body: responseBytes);
        }

        private IBasicProperties CreateReplyProperties(IBasicProperties requestProperties)
        {
            var replyProperties = Channel.CreateBasicProperties();
            replyProperties.CorrelationId = requestProperties.CorrelationId;
            return replyProperties;
        }
    }
}

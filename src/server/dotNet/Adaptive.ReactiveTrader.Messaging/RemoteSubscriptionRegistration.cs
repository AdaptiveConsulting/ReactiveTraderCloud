using System;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class RemoteSubscriptionRegistration: RemoteProcedureBase
    {
        private readonly Func<IRequestContext, IMessage, Task> _messageHandler;

        public RemoteSubscriptionRegistration(IModel channel, string procName, Func<IRequestContext, IMessage, Task> messageHandler) : base (channel, procName)
        {
            _messageHandler = messageHandler;
        }

        protected override async Task HandleMessage(RequestContext requestContext, IBasicProperties _)
        {
            await _messageHandler(requestContext, requestContext.RequestMessage);
        }
    }
}

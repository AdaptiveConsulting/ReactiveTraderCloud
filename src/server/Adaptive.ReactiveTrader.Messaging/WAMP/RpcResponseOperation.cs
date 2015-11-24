using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class RpcResponseOperation<TResponse> : IWampRpcOperation
    {
        private readonly Func<IRequestContext, IMessage, Task<TResponse>> _serviceMethod;

        public RpcResponseOperation(string name, Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod)
        {
            Procedure = name;
            _serviceMethod = serviceMethod;
        }

        public string Procedure { get; }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller, IWampFormatter<TMessage> formatter,
            InvocationDetails details)
        {
            var dummyDetails = new Dictionary<string, object>();

            caller.Error(WampObjectFormatter.Value, dummyDetails, "wamp.error.runtime_error",
                new object[] { "Expected parameters" });
        }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller, IWampFormatter<TMessage> formatter,
            InvocationDetails details,
            TMessage[] arguments)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);
        }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller, IWampFormatter<TMessage> formatter,
            InvocationDetails details,
            TMessage[] arguments, IDictionary<string, TMessage> argumentsKeywords)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);
        }

        private static void InnerInvoke<T>(Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod,
            IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<T> formatter,
            T[] arguments)
        {
            var x = formatter.Deserialize<MessageDto>(arguments[0]);

            var message = new Message()
            {
                ReplyTo = new WampTransientDestination(x.ReplyTo),
                Payload = Encoding.UTF8.GetBytes(x.Payload.ToString()) // TODO need to stop this from deserializing
            };

            var userSession = new UserSession
            {
                Username = x.Username
            };

            var userContext = new RequestContext(message, userSession);

            var response = serviceMethod(userContext, message);

            var dummyDetails = new YieldOptions();
            caller.Result(WampObjectFormatter.Value, dummyDetails, new object[] {response});
        }
    }
}
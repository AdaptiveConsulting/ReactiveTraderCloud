using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Serilog;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class RpcOperation : IWampRpcOperation
    {
        //protected static readonly ILogger Log = Log.ForContext<RpcOperation>();

        private readonly Func<IRequestContext, IMessage, Task> _serviceMethod;

        public RpcOperation(string name, Func<IRequestContext, IMessage, Task> serviceMethod)
        {
            Procedure = name;
            _serviceMethod = serviceMethod;
        }

        public string Procedure { get; }

        public IWampCancellableInvocation Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<TMessage> formatter,
            InvocationDetails details)
        {
            var dummyDetails = new Dictionary<string, object>();

            caller.Error(WampObjectFormatter.Value,
                dummyDetails,
                "wamp.error.runtime_error",
                new object[] {"Expected parameters"});

            // see: http://wampsharp.net/release-notes/wampsharp-v1.2.6.41-beta-release-notes/
            // section: "Internal/Breaking changes"
            return null;
        }

        public IWampCancellableInvocation Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<TMessage> formatter,
            InvocationDetails details,
            TMessage[] arguments)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);

            // see: http://wampsharp.net/release-notes/wampsharp-v1.2.6.41-beta-release-notes/
            // section: "Internal/Breaking changes"
            return null;
        }

        public IWampCancellableInvocation Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<TMessage> formatter,
            InvocationDetails details,
            TMessage[] arguments,
            IDictionary<string, TMessage> argumentsKeywords)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);

            // see: http://wampsharp.net/release-notes/wampsharp-v1.2.6.41-beta-release-notes/
            // section: "Internal/Breaking changes"
            return null;
        }

        private void InnerInvoke<T>(Func<IRequestContext, IMessage, Task> serviceMethod,
            IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<T> formatter,
            T[] arguments)
        {
            var dummyDetails = new YieldOptions();

            try
            {
                Task.Run(async () =>
                {
                    try
                    {
                        var guid = Guid.NewGuid();

                        Log.Debug($"[{guid}] RPC operation inner invoke");

                        var x = formatter.Deserialize<MessageDto>(arguments[0]);

                        var payload = x.Payload.ToString();

                        var message = new Message
                        {
                            ReplyTo = new WampTransientDestination(x.ReplyTo),
                            Payload = Encoding.UTF8.GetBytes(payload)
                        };

                        var userSession = new UserSession
                        {
                            Username = x.Username
                        };

                        var userContext = new RequestContext(message, userSession);

                        Log.Debug(
                            $"[{guid}] Calling service method from Username: {userSession.Username}, ReplyTo: {message.ReplyTo}, Payload: {payload}");

                        await serviceMethod(userContext, message);

                        Log.Debug($"[{guid}] Service method called with no exceptions");
                    }
                    catch (Exception e1)
                    {
                        Log.Error(e1, "Error processing RPC operation");
                    }
                });

                caller.Result(WampObjectFormatter.Value, dummyDetails);
            }
            catch (Exception e2)
            {
                Log.Error(e2, "Error processing RPC operation");
                caller.Error(WampObjectFormatter.Value, dummyDetails, e2.Message);
            }
        }
    }
}

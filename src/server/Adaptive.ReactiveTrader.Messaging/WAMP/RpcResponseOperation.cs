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
    internal class RpcResponseOperation<TResponse> : IWampRpcOperation
    {
        //protected static readonly ILogger Log = Log.ForContext<RpcOperation>();

        private readonly Func<IRequestContext, IMessage, Task<TResponse>> _serviceMethod;

        public RpcResponseOperation(string name, Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod)
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

        private void InnerInvoke<T>(Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod,
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
                        var x = formatter.Deserialize<MessageDto>(arguments[0]);

                        var message = new Message
                        {
                            ReplyTo = new WampTransientDestination(x.ReplyTo),
                            Payload =
                                Encoding.UTF8.GetBytes(x.Payload
                                    .ToString()) // TODO need to stop this from deserializing
                        };

                        var userSession = new UserSession
                        {
                            Username = x.Username
                        };

                        var userContext = new RequestContext(message, userSession);

                        var response = await serviceMethod(userContext, message);

                        caller.Result(WampObjectFormatter.Value, dummyDetails, new object[] {response});
                    }
                    catch (Exception e1)
                    {
                        OnError(caller, e1, dummyDetails);
                    }
                });
            }
            catch (Exception e2)
            {
                OnError(caller, e2, dummyDetails);
            }
        }

        private static void OnError(IWampRawRpcOperationRouterCallback caller, Exception exception,
            YieldOptions dummyDetails)
        {
            Log.Error(exception, "Error processing RPC request response");
            caller.Error(WampObjectFormatter.Value, dummyDetails, exception.Message);
        }
    }
}

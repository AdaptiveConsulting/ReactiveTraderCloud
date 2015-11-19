using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SystemEx;
using WampSharp.Core.Listener;
using WampSharp.Core.Serialization;
using WampSharp.V2;
using WampSharp.V2.Core;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Realm;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Broker : IBroker
    {
        private readonly IWampChannel _channel;
        private readonly IWampRealmServiceProvider _services;

        public Broker(string uri, string realm)
        {
            var factory = new DefaultWampChannelFactory();
            _channel = factory.CreateJsonChannel(uri, realm);

            var monitor = _channel.RealmProxy.Monitor;

            monitor.ConnectionBroken += OnClose;
            monitor.ConnectionError += OnError;

            _services = _channel.RealmProxy.Services;
        }

        public async Task RegisterService(object service, ServiceMethod method)
        {
            string invoke;
            switch (method)
            {
                case ServiceMethod.RoundRobin:
                    invoke = "roundrobin";
                    break;
                case ServiceMethod.Random:
                    invoke = "random";
                    break;

                default:
                    invoke = "first";
                    break;
            }

            await _services.RegisterCallee(service, new CalleeRegistrationInterceptor(new RegisterOptions
            {
                Invoke = invoke
            }));
        }

      
        public async Task<IObserver<T>> CreateChannelAsync<T>(string topic)
        {
            return await Task.Run(() => _services.GetSubject<T>(topic));
        }

        public void RegisterCall(string v, Action<Message> onMessage)
        {
            var rpcOperation = new RpcOperation(v, onMessage);
            var realm = _channel.RealmProxy;

            var registerOptions = new RegisterOptions
            {
                Invoke = "roundrobin",
            };

            realm.RpcCatalog.Register(rpcOperation, registerOptions);
        }

        private static void OnClose(object sender, WampSessionCloseEventArgs e)
        {
            Console.WriteLine("connection closed. reason: " + e.Reason);
        }

        private static void OnError(object sender, WampConnectionErrorEventArgs e)
        {
            Console.WriteLine("connection error. error: " + e.Exception);
        }

        public async Task Open()
        {
            await _channel.Open();
        }
    }
    
    internal class RpcOperation : IWampRpcOperation
    {
        private readonly Action<Message> _serviceMethod;

        public RpcOperation(string name, Action<Message> serviceMethod)
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

        private static void InnerInvoke<T>(Action<Message> serviceMethod, IWampRawRpcOperationRouterCallback caller,
            IWampFormatter<T> formatter,
            T[] arguments)
        {
            var x = formatter.Deserialize<Message>(arguments[0]);

            serviceMethod(x);

            var dummyDetails = new YieldOptions();
            caller.Result(WampObjectFormatter.Value, dummyDetails);
        }
    }
}
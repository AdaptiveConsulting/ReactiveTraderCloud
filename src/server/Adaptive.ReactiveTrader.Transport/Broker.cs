using System;
using System.Threading.Tasks;
using WampSharp.Core.Listener;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Realm;

namespace Adaptive.ReactiveTrader.Transport
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
        
        

        public async Task RegisterService(object service)
        {
            await _services.RegisterCallee(service, new CalleeRegistrationInterceptor(new RegisterOptions
            {
                Invoke = "roundrobin"
            }));
        }
    }
}
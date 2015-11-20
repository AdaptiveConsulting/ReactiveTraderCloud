using System;
using System.Threading.Tasks;
using WampSharp.Core.Listener;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Realm;

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
      
        public async Task RegisterCall(string v, Action<IRequestContext, IMessage> onMessage)
        {
            var rpcOperation = new RpcOperation(v, onMessage);
            var realm = _channel.RealmProxy;

            var registerOptions = new RegisterOptions
            {
                Invoke = "roundrobin",
            };

            await realm.RpcCatalog.Register(rpcOperation, registerOptions);
        }

        public async Task<IObserver<T>> CreateChannelAsync<T>(ITransientDestination replyTo)
        {
            var desination = (WampTransientDestination) replyTo;
            return await Task.Run(() => _services.GetSubject<T>(desination.Topic));
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
}
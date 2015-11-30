using System;
using WampSharp.Binding;
using WampSharp.Fleck;
using WampSharp.V2;
using WampSharp.V2.MetaApi;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    public class MessageBroker : IDisposable
    {
        private WampHost _router;

        public void Dispose()
        {
            _router.Dispose();
        }

        public void Start()
        {
            _router = new WampHost();
            var jsonBinding = new JTokenJsonBinding();
            var msgPack = new JTokenMsgpackBinding();

            _router.RegisterTransport(new FleckWebSocketTransport("ws://0.0.0.0:8080/ws"), jsonBinding, msgPack);
            _router.Open();

            var realm = _router.RealmContainer.GetRealmByName("com.weareadaptive.reactivetrader");
            realm.HostMetaApiService();
        }
    }
}
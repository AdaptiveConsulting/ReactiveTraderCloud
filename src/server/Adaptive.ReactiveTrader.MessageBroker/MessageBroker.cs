using System;
using WampSharp.Binding;
using WampSharp.Fleck;
using WampSharp.V2;

namespace Adaptive.ReactiveTrader.MessageBroker
{
    public class MessageBroker
    {
        private WampHost _router;

        public void Start()
        {
            _router = new WampHost();
            _router.RegisterTransport(new FleckWebSocketTransport("ws://127.0.0.1:8080/ws"), new JTokenJsonBinding(), new JTokenMsgpackBinding());
            // TODO add signalr transport
            
            _router.Open();
        }

        public void Status()
        {
            var realm = _router.RealmContainer.GetRealmByName("com.weareadaptive.reactivetrader");
            foreach (var t in realm.TopicContainer.Topics)
            {
                Console.WriteLine(t.TopicUri);
            }
        }

    }
}
using System;
using System.Linq;
using System.Reactive;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.MetaApi;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Broker : IBroker
    {
        private readonly IWampChannel _channel;
        private WampMetaApiServiceProxy _meta;
        private readonly IObservable<long> _sessionTeardowns;
        private readonly IObservable<long> _subscriptionTeardowns;

        public Broker(string uri, string realm)
        {
            var factory = new DefaultWampChannelFactory();
            _channel = factory.CreateJsonChannel(uri, realm);

            _sessionTeardowns =
                Observable.Create<long>(async o =>
                {
                    var r = await _meta.SubscribeTo.Session.OnLeave(o.OnNext);
                    return Disposable.Create(async () => await r.DisposeAsync());
                }).Publish().RefCount();

            _subscriptionTeardowns =
                Observable.Create<long>(
                    async observer =>
                    {
                        var r = await _meta.SubscribeTo.Subscription.OnUnsubscribe(
                            (sessionID, subscriptionId) => { observer.OnNext(subscriptionId); });
                        return Disposable.Create(async () => await r.DisposeAsync());
                    }).Publish().RefCount();
        }

        public async Task RegisterCall(string v, Func<IRequestContext, IMessage, Task> onMessage)
        {
            var rpcOperation = new RpcOperation(v, onMessage);
            var realm = _channel.RealmProxy;

            var registerOptions = new RegisterOptions
            {
                Invoke = "roundrobin",
            };

            await realm.RpcCatalog.Register(rpcOperation, registerOptions);
        }

        public async Task<IPrivateEndPoint<T>> GetEndPoint<T>(ITransientDestination destination)
        {
            var desination = (WampTransientDestination) destination;
            var subID = await _meta.LookupSubscriptionIdAsync(desination.Topic, new SubscribeOptions {Match = "exact"});

            Console.WriteLine("Create subscription {0} ({1})", subID, desination);

            if (!subID.HasValue) // subscription is already disposed
                throw new Exception();

            var sessionID = (await _meta.GetSubscribersAsync(subID.Value)).First();
            var breaker =
                _sessionTeardowns.Where(s => s == sessionID).Select(_ => Unit.Default)
                    .Merge(_subscriptionTeardowns.Where(s => s == subID.Value).Select(_ => Unit.Default))
                    .Take(1)
                    .Do(o => Console.WriteLine("Remove subscription for {0} ({1})", subID, desination));

            var subject = _channel.RealmProxy.Services.GetSubject<T>(desination.Topic);

            return new PrivateEndPoint<T>(subject, breaker);
        }

        public async Task<bool> Subscribers(string topic)
        {
            var subscriptionID = await _meta.LookupSubscriptionIdAsync(topic, new SubscribeOptions());
            var sub = await _meta.CountSubscribersAsync(subscriptionID.Value);

            return sub > 1;
        }

        public async Task Open()
        {
            await _channel.Open();

            _meta = _channel.RealmProxy.GetMetaApiServiceProxy();
        }
    }
}
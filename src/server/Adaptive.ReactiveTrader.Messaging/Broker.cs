using System;
using System.Linq;
using System.Reactive;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using SystemEx;
using Adaptive.ReactiveTrader.Messaging.WAMP;
using Common.Logging;
using WampSharp.V2;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.MetaApi;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Broker : IBroker, IDisposable
    {
        private static readonly ILog Log = LogManager.GetLogger<Broker>();

        private readonly IWampChannel _channel;
        private readonly WampMetaApiServiceProxy _meta;
        private readonly IObservable<long> _sessionTeardowns;
        private readonly IObservable<long> _subscriptionTeardowns;
        private readonly Subject<Unit> _brokerTeardown;



        public Broker(IWampChannel channel)
        {
            _channel = channel;

            _meta = _channel.RealmProxy.GetMetaApiServiceProxy();

            _sessionTeardowns =
                Observable.Create<long>(async o =>
                {
                    var r = await _meta.SubscribeTo.Session.OnLeave(o.OnNext);
                    return Disposable.Create(async () =>
                    {
                        try
                        {
                            await r.DisposeAsync();
                        }
                        catch (Exception e)
                        {
                            Log.Error("Couldn't close subscription to sessions. Perhaps broker shutdown." + e.Message);
                        }
                    });
                }).Publish().RefCount();

            _subscriptionTeardowns =
                Observable.Create<long>(
                    async observer =>
                    {
                        var r = await _meta.SubscribeTo.Subscription.OnUnsubscribe(
                            (sessionID, subscriptionId) => { observer.OnNext(subscriptionId); });
                        return Disposable.Create(async () => {
                            try
                            {
                                await r.DisposeAsync();
                            }
                            catch (Exception e)
                            {
                                Log.Error("Couldn't close subscription to subscriptions. Perhaps broker shutdown." + e.Message);
                            }
                        });
                    }).Publish().RefCount();

            _brokerTeardown = new Subject<Unit>();
        }

        public async Task<IAsyncDisposable> RegisterCall(string procName,
            Func<IRequestContext, IMessage, Task> onMessage)
        {
            if (Log.IsInfoEnabled)
            {
                Log.Info($"Registering call: [{procName}]");
            }

            var rpcOperation = new RpcOperation(procName, onMessage);
            var realm = _channel.RealmProxy;

            var registerOptions = new RegisterOptions
            {
                Invoke = "single"
            };

            return await realm.RpcCatalog.Register(rpcOperation, registerOptions);
        }

        public async Task<IAsyncDisposable> RegisterCallResponse<TResponse>(string procName,
            Func<IRequestContext, IMessage, Task<TResponse>> onMessage)
        {
            if (Log.IsInfoEnabled)
            {
                Log.Info($"Registering call with response: [{procName}]");
            }

            var rpcOperation = new RpcResponseOperation<TResponse>(procName, onMessage);
            var realm = _channel.RealmProxy;

            var registerOptions = new RegisterOptions
            {
                Invoke = "roundrobin",
            };

            return await realm.RpcCatalog.Register(rpcOperation, registerOptions);
        }

        public async Task<IPrivateEndPoint<T>> GetPrivateEndPoint<T>(ITransientDestination destination)
        {
            var dest = (WampTransientDestination) destination;
            var subID = await _meta.LookupSubscriptionIdAsync(dest.Topic, new SubscribeOptions {Match = "exact"});

            Log.DebugFormat("Create subscription {0} ({1})", subID, dest);

            if (!subID.HasValue)
            {
                // subscription is already disposed 
                Log.ErrorFormat("Subscription not found for topic {0}", dest.Topic);
                throw new Exception("No subscribers found for private subscription.");
            }
            var sessionID = (await _meta.GetSubscribersAsync(subID.Value)).FirstOrDefault();

            if (sessionID == 0)
            {
                Log.ErrorFormat("Subscription found but there are no subscriptions for topic {0}", dest.Topic);
                throw new Exception("No subscribers found for private subscription.");
            }

            var breaker =
                _sessionTeardowns.Where(s => s == sessionID).Select(_ => Unit.Default)
                    .Merge(_subscriptionTeardowns.Where(s => s == subID.Value).Select(_ => Unit.Default))
                        .Merge(_brokerTeardown)
                    .Take(1)
                    .Do(o => Log.DebugFormat("Remove subscription for {0} ({1})", subID, dest));

            var subject = _channel.RealmProxy.Services.GetSubject<T>(dest.Topic);

            return new PrivateEndPoint<T>(subject, breaker);
        }

        public Task<IEndPoint<T>> GetPublicEndPoint<T>(string destination)
        {
            var subject = _channel.RealmProxy.Services.GetSubject<T>(destination);
            return Task.FromResult((IEndPoint<T>)new EndPoint<T>(subject));
        }

        public IObservable<T> SubscribeToTopic<T>(string topic)
        {
            return _channel.RealmProxy.Services.GetSubject<T>(topic);
        }

        public void Dispose()
        {
          _brokerTeardown.OnNext(Unit.Default);
        }
    }
}
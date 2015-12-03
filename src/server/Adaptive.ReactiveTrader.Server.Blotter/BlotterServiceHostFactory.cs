using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHostFactory : IServceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<BlotterServiceHostFactory>();

        private BlotterService _service;
        private TradeCache _cache;

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new BlotterServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return null;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStore)
        {
            _cache = new TradeCache(eventStore);
            _service = new BlotterService(_cache.GetTrades());
            var disposable = brokerStream.LaunchOrKill(broker => new BlotterServiceHost(_service, broker)).Subscribe();

            _cleanup.Add(disposable);

            return disposable;
        }
    }
}
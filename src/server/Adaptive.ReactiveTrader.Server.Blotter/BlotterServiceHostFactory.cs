using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Host;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<BlotterServiceHostFactory>();

        private readonly CompositeDisposable _cleanup = new CompositeDisposable();
        private TradeCache _cache;

        private BlotterService _service;

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

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new BlotterServiceHost(_service, broker));
        }
    }
}
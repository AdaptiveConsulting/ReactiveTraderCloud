using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReadServiceHostFactory : IServceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataReadServiceHostFactory>();
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();
        private ReferenceService _service;
        private CurrencyPairCache _cache;

        public void Initialize(IEventStoreConnection es)
        {
            _cache = new CurrencyPairCache(es);
            _cache.Initialize();

            _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new ReferenceReadServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return Disposable.Empty;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream,
            IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            _cache = new CurrencyPairCache(eventStoreStream);
            _cache.Initialize();
            _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
            var disposable =
                brokerStream.LaunchOrKill(broker => new ReferenceReadServiceHost(_service, broker)).Subscribe();
            _cleanup.Add(disposable);

            return disposable;
        }
    }
}
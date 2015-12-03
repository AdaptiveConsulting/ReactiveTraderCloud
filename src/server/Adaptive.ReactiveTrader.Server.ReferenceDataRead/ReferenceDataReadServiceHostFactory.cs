using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;
using System;
using System.Reactive.Disposables;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReadServiceHostFactory : IServceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataReadServiceHostFactory>();
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();
        private ReferenceService _service;
        private CurrencyPairCache _cache;

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
            _service = new ReferenceService(_cache.GetCurrencyPairUpdates());
            var disposable = brokerStream.LaunchOrKill(broker => new ReferenceReadServiceHost(_service, broker))
                                         .Subscribe();
            _cleanup.Add(disposable);

            return disposable;
        }
    }
}
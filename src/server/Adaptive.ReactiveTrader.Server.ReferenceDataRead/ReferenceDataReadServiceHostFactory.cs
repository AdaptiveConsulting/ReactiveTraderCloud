using System;
using System.Reactive.Disposables;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Core;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceDataReadServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataReadServiceHostFactory>();
        private readonly CompositeDisposable _cleanup = new CompositeDisposable();
        private CurrencyPairCache _cache;
        private ReferenceService _service;

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
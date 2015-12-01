using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public class ReferenceDataWriteServiceHostFactory : IServiceHostFactory, IEventStoreConsumer, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceDataWriteServiceHostFactory>();

        private Repository _repository;
        private ReferenceWriteService _service;

        public void Initialize(IEventStoreConnection es)
        {
            _repository = new Repository(es);
            _service = new ReferenceWriteService(_repository);
        }

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new ReferenceWriteServiceHost(_service, broker));
        }

        public void Dispose()
        {

        }
    }
}
using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceService : IReferenceService
    {
        protected static readonly ILog Log = LogManager.GetLogger<ReferenceService>();
        private readonly IObservable<CurrencyPairUpdatesDto> _repository;
        
        public ReferenceService(IObservable<CurrencyPairUpdatesDto> repository)
        {
            _repository = repository;
        }
        
        public IObservable<CurrencyPairUpdatesDto> GetCurrencyPairUpdatesStream(IRequestContext context, NothingDto request)
        {
            return _repository;
        }
    }
}
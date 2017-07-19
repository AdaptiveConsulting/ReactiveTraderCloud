using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class ReferenceService : IReferenceService
    {
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
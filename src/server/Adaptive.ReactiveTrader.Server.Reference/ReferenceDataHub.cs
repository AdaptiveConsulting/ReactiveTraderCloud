using System;
using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class ReferenceDataHub : IReferenceDataHub
    {
        private readonly ICurrencyPairRepository _currencyPairRepository;

        public ReferenceDataHub(ICurrencyPairRepository currencyPairRepository)
        {
            _currencyPairRepository = currencyPairRepository;
        }

        public IEnumerable<CurrencyPairUpdateDto> GetCurrencyPairs()
        {
            Console.WriteLine("ReferenceDataHub.GetCurrencyPairs() called.");

            var currencyPairs = _currencyPairRepository.GetAllCurrencyPairInfos().Where(cp => cp.Enabled).Select(cp => cp.CurrencyPair).ToList();
            Console.WriteLine("Sending {0} currency pairs'", currencyPairs.Count);
            
            return currencyPairs.Select(cp => new CurrencyPairUpdateDto
            {
                CurrencyPair = cp,
                UpdateType = UpdateTypeDto.Added
            });
        }
    }
}
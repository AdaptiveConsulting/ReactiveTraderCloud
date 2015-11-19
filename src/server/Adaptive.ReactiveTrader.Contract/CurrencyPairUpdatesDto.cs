using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Contract
{
    public class CurrencyPairUpdatesDto
    {
        public IEnumerable<CurrencyPairUpdateDto> Updates { get; set; }
    }
}
using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPairUpdatesDto
    {
        public static CurrencyPairUpdatesDto Empty = new CurrencyPairUpdatesDto(new CurrencyPairUpdateDto[0]);

        public CurrencyPairUpdatesDto(IList<CurrencyPairUpdateDto> updates)
        {
            Updates = updates;
        }

        public IList<CurrencyPairUpdateDto> Updates { get; }
    }
}
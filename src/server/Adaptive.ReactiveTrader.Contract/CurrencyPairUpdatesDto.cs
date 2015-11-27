using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Contract
{
    public class CurrencyPairUpdatesDto
    {
        public static CurrencyPairUpdatesDto Empty = new CurrencyPairUpdatesDto(new CurrencyPairUpdateDto[0], false);

        public CurrencyPairUpdatesDto(IList<CurrencyPairUpdateDto> updates, bool isStateOfTheWorld)
        {
            Updates = updates;
            IsStateOfTheWorld = isStateOfTheWorld;
        }

        public IList<CurrencyPairUpdateDto> Updates { get; }
        public bool IsStateOfTheWorld { get; }
    }
}
using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Shared.DTO.ReferenceData
{
    public class CurrencyPairUpdatesDto
    {
        public static CurrencyPairUpdatesDto Empty = new CurrencyPairUpdatesDto(new CurrencyPairUpdateDto[0], false, false);

        public CurrencyPairUpdatesDto(IList<CurrencyPairUpdateDto> updates, bool isStateOfTheWorld, bool isStale)
        {
            Updates = updates;
            IsStateOfTheWorld = isStateOfTheWorld;
            IsStale = isStale;
        }

        public IList<CurrencyPairUpdateDto> Updates { get; }
        public bool IsStateOfTheWorld { get; }
        public bool IsStale { get; }
    }
}
using Adaptive.ReactiveTrader.Server.ReferenceData;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataRead
{
    public class CurrencyPairUpdateDto
    {
        public UpdateTypeDto UpdateType { get; set; }
        public CurrencyPairDto CurrencyPair { get; set; }

        public override string ToString()
        {
            return $"UpdateType: {UpdateType}, CurrencyPair: {CurrencyPair}";
        }
    }
}
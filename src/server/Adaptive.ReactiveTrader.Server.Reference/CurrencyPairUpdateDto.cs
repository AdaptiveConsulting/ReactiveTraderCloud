namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public class CurrencyPairUpdateDto
    {
        public UpdateTypeDto UpdateType { get; set; }
        public CurrencyPairDto CurrencyPair { get; set; }

        public override string ToString()
        {
            return string.Format("UpdateType: {0}, CurrencyPair: {1}", UpdateType, CurrencyPair);
        }
    }
}
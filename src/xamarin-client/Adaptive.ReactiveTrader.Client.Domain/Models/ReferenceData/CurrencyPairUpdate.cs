namespace Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData
{
    internal class CurrencyPairUpdate : ICurrencyPairUpdate
    {
        public CurrencyPairUpdate(UpdateType updateType, ICurrencyPair currencyPair)
        {
            UpdateType = updateType;
            CurrencyPair = currencyPair;
        }

        public UpdateType UpdateType { get; private set; }
        public ICurrencyPair CurrencyPair { get; private set; }
    }
}
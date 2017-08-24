namespace Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData
{
    public interface ICurrencyPairUpdate
    {
        UpdateType UpdateType { get; }
        ICurrencyPair CurrencyPair { get; }
    }
}
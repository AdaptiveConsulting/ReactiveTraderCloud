using Adaptive.ReactiveTrader.Shared.DTO.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData
{
    internal interface ICurrencyPairUpdateFactory
    {
        ICurrencyPairUpdate Create(CurrencyPairUpdateDto currencyPairUpdate);
    }
}
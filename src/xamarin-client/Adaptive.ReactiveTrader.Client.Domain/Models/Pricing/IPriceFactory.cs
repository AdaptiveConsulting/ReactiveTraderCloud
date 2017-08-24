using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Pricing
{
    internal interface IPriceFactory
    {
        IPrice Create(PriceDto price, ICurrencyPair currencyPair);
    }
}
namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPriceLastValueCache
    {
        PriceDto GetLastValue(string currencyPair);
        void StoreLastValue(PriceDto price);
    }
}
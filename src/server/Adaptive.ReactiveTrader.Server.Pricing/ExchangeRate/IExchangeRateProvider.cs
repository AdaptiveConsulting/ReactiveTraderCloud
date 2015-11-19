namespace Adaptive.ReactiveTrader.Server.Pricing.ExchangeRate
{
    public interface IExchangeRateProvider
    {
        decimal? GetExchangeRate(string currencySymbol);
    }
}
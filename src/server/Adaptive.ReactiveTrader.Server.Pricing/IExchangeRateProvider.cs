namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IExchangeRateProvider
    {
        decimal? GetExchangeRate(string currencySymbol);
    }
}
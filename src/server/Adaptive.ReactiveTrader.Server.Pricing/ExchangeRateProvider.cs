using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    internal sealed class ExchangeRateProvider : IExchangeRateProvider
    {
        private readonly Dictionary<string, decimal> _exchangeRates;

        public ExchangeRateProvider()
        {
            // TODO: grab this from admin UI?
            _exchangeRates = new Dictionary<string, decimal>
            {
                {"EURUSD", 1.0705m },
                {"USDJPY", 122.926m },
                {"GBPUSD", 1.5292m },
                {"GBPJPY", 187.969m },
                {"EURGBP", 0.7003m },
                {"USDCHF", 1.0161m },
                {"EURJPY", 131.674m },
                {"EURCHF", 1.0888m },
                {"AUDUSD", 0.7194m },
                {"NZDUSD", 0.6566m },
                {"EURCAD", 1.4228m },
                {"EURAUD", 1.4904m },
                {"AUDCAD", 0.9549m },
                {"GBPCHF", 1.5531m },
                {"CHFJPY", 120.96m },
                {"AUDJPY", 88.3794m },
                {"AUDNZD", 1.0956m },
                {"CADJPY", 92.5361m },
                {"CHFUSD", 0.9844m },
                {"EURNOK", 9.2409m },
                {"EURSEK", 9.3047m }
            };
        }
        public decimal? GetExchangeRate(string currencySymbol)
        {
            decimal rate;
            if (_exchangeRates.TryGetValue(currencySymbol, out rate))
            {
                return rate;
            }
            return null;
        }
    }
}
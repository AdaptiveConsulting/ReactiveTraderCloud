using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{
    class NotificationCurrencyPair
    {
        readonly string _baseCurrency;
        readonly string _counterCurrency;

        public NotificationCurrencyPair(string baseCurrency, string counterCurrency)
        {
            _baseCurrency = baseCurrency;
            _counterCurrency = counterCurrency;
        }

        public bool Matches(ICurrencyPair pair)
        {
            if (pair == null)
            {
                return false;
            }

            return (pair.BaseCurrency == _baseCurrency && pair.CounterCurrency == _counterCurrency);
        }
    }	
}

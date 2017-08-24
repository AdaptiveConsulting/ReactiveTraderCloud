using System;
using Foundation;
using Newtonsoft.Json;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Client.Domain.Models;

namespace Adaptive.ReactiveTrader.Client.iOS.Shared
{
    public static class TradeToNSObjectExtention
    {
        public static NSString ToNSString(this ITrade trade)
        {
            var json = JsonConvert.SerializeObject(trade);
            return new NSString(json);
        }

        public static ITrade ToTrade(this NSString nsString)
        {
            return JsonConvert.DeserializeObject<Trade>(nsString);
        }

        public static NSString ToNSString(this ICurrencyPair currencyPair)
        {
            var json = JsonConvert.SerializeObject(currencyPair);
            return new NSString(json);
        }

        public static ICurrencyPair ToCurrencyPair(this NSString nsString, IObservable<PriceDto> priceStream)
        {
            var pair = JsonConvert.DeserializeObject<CurrencyPair>(nsString);
            pair.PriceStream = priceStream.Cast<IPrice>();
            return pair;
        }
    }

    internal class CurrencyPair : ICurrencyPair
    {
        public string Symbol { get; set; }
        public int RatePrecision { get; set; }
        public int PipsPosition { get; set; }
        public string BaseCurrency { get; set; }
        public string CounterCurrency { get; set; }
        public IObservable<IPrice> PriceStream { get; internal set; }
    }

    internal class Trade : ITrade
    {
        public string CurrencyPair { get; set; }
        public Direction Direction { get; set; }
        public long Notional { get; set; }
        public decimal SpotRate { get; set; }
        public TradeStatus TradeStatus { get; set; }
        public DateTime TradeDate { get; set; }
        public long TradeId { get; set; }
        public string TraderName { get; set; }
        public DateTime ValueDate { get; set; }
        public string DealtCurrency { get; set; }
    }
}

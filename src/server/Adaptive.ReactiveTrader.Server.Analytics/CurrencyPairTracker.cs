using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class CurrencyPairTracker
    {
        private decimal _baseTradedAmount;
        private decimal _counterTradedAmount;
        private decimal _baseSpot;

        public CurrencyPairTracker(string currencyPair)
        {
            CurrencyPair = currencyPair;
            CrossedPair = currencyPair.Substring(0, 3) + "USD";
        }

        public string CurrencyPair { get; }

        public string CrossedPair { get; }

        public int TradeCount { get; private set; }

        public CurrencyPairPositionReport CurrentPosition { get; private set; } = new CurrencyPairPositionReport();

        public void OnTrade(TradeDto trade, IDictionary<string, SpotPriceDto> priceCache)
        {
            if (trade.Status != TradeStatusDto.Done)
                return;

            if (trade.Direction == DirectionDto.Buy)
            {
                _baseTradedAmount += trade.Notional;
                _counterTradedAmount += (trade.Notional * trade.SpotRate);
            }
            else
            {
                _baseTradedAmount -= trade.Notional;
                _counterTradedAmount -= (trade.Notional * trade.SpotRate);
            }
            TradeCount++;

            OnPrice(priceCache, true);
        }

        public void OnPrice(IDictionary<string, SpotPriceDto> priceCache, bool wasTraded)
        {
            var isLong = _baseTradedAmount >= 0;
            var isUsdBased = CurrencyPair.StartsWith("USD");

            SpotPriceDto monitoredPrice, crossedPrice = null;
            if (!priceCache.TryGetValue(CurrencyPair, out monitoredPrice)
                || (!isUsdBased && !priceCache.TryGetValue(CrossedPair, out crossedPrice)))
            {
                return;
            }

            _baseSpot = isLong
                ? _counterTradedAmount / monitoredPrice.Bid
                : _counterTradedAmount / monitoredPrice.Ask;

            var basePnl = _baseTradedAmount - _baseSpot;

            decimal usdPnl;
            if (isUsdBased)
            {
                usdPnl = basePnl;
            }
            else
            {
                usdPnl = isLong
                    ? basePnl * crossedPrice.Bid
                    : basePnl * crossedPrice.Ask;
            }

            CurrentPosition = new CurrencyPairPositionReport
            {
                Symbol = CurrencyPair,
                BaseTradedAmount = _baseTradedAmount,
                BasePnl = basePnl,
                UsdPnl = usdPnl,
                WasTraded = wasTraded
            };
        }
    }
}
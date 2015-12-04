using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public interface IAnalyticsService
    {
        IObservable<PositionUpdatesDto> GetAnalyticsStream();
        void OnTrade(TradeDto trade);
        void OnPrice(SpotPriceDto price);
    }
}
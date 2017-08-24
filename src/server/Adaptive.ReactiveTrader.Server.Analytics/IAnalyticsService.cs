using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public interface IAnalyticsService
    {
        IObservable<PositionUpdatesDto> GetAnalyticsStream();
        void OnTrade(TradeDto trade);
        void OnPrice(SpotPriceDto price);
    }
}
using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly AnalyticsEngine _analyticsEngine;

        public AnalyticsService(AnalyticsEngine analyticsEngine)
        {
            _analyticsEngine = analyticsEngine;
        }

        public IObservable<PositionUpdatesDto> GetAnalyticsStream()
        {
            return _analyticsEngine.
        }

        public void OnTrade(TradeDto trade)
        {
            _analyticsEngine.OnTrade(trade);
        }

        public void OnPrice(SpotPriceDto spotPriceDto)
        {
            _analyticsEngine.OnPrice(spotPriceDto);
        }
    }
}
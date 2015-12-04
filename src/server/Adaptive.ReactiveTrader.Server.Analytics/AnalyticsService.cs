using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        private static readonly ILog Log = LogManager.GetLogger<AnalyticsService>();
        private readonly AnalyticsEngine _analyticsEngine;

        public AnalyticsService(AnalyticsEngine analyticsEngine)
        {
            _analyticsEngine = analyticsEngine;
        }

        public IObservable<PositionUpdatesDto> GetAnalyticsStream()
        {
            return _analyticsEngine.PositionUpdatesStream;
        }

        public void OnTrade(TradeDto trade)
        {
            Log.Info("Received done trade");
            _analyticsEngine.OnTrade(trade);
        }

        public void OnPrice(SpotPriceDto price)
        {
            if (price.Symbol == "EURUSD")
            {
                Log.Info("Received EURUSD price tick");
            }
            _analyticsEngine.OnPrice(price);
        }
    }
}
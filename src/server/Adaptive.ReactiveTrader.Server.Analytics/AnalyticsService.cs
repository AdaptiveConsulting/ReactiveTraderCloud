using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Contract;
using Serilog;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        //private static readonly ILogger Log = Log.ForContext<AnalyticsService>();
        private readonly AnalyticsEngine _analyticsEngine;

        public AnalyticsService(AnalyticsEngine analyticsEngine)
        {
            _analyticsEngine = analyticsEngine;
        }

        public IObservable<PositionUpdatesDto> GetAnalyticsStream()
        {
            return _analyticsEngine.PositionUpdatesStream
                                   .Publish()
                                   .RefCount();
        }

        public void OnTrade(TradeDto trade)
        {
            Log.Information("Received done trade");
            _analyticsEngine.OnTrade(trade);
        }

        public void OnPrice(SpotPriceDto price)
        {
            _analyticsEngine.OnPrice(price);
        }
    }
}
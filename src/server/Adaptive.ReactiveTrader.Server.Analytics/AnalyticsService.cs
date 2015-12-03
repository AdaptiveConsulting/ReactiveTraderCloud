using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        public AnalyticsService()
        {
        }

        public IObservable<PositionUpdatesDto> GetAnalyticsStream()
        {
            throw new NotImplementedException();
        }
    }
}
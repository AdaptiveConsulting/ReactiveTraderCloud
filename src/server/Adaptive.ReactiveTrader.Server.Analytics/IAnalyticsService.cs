using System;
using Adaptive.ReactiveTrader.Server.Analytics.Dto;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public interface IAnalyticsService
    {
        IObservable<PositionUpdatesDto> GetAnalyticsStream();
    }
}
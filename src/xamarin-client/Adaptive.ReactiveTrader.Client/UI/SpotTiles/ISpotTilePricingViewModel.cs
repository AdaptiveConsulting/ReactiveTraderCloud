using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface ISpotTilePricingViewModel : IViewModel, IDisposable
    {
        SpotTileSubscriptionMode SubscriptionMode { get; set; }
        SpotTileExecutionMode ExecutionMode { get; set; }
        string Symbol { get; }
        IOneWayPriceViewModel Bid { get; }
        IOneWayPriceViewModel Ask { get; }
        string Notional { get; set; }
        string Spread { get; }
        string DealtCurrency { get; }
        PriceMovement Movement { get; }
        string SpotDate { get; }
        bool IsSubscribing { get; }
        bool IsStale { get; }
        void OnTrade(ITrade trade);
        void OnExecutionError(string message);
        decimal Mid { get; }
        decimal[] HistoricalMid { get; }
    }
}

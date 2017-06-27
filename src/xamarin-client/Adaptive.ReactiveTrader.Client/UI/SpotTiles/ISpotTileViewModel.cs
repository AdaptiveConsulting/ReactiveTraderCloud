using System;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface ISpotTileViewModel : IViewModel, IDisposable
    {
        ISpotTilePricingViewModel Pricing { get; }
        ISpotTileAffirmationViewModel Affirmation { get; }
        ISpotTileErrorViewModel Error { get; }
        ISpotTileConfigViewModel Config { get; }
        TileState State { get; }
        string CurrencyPair { get; }
        void OnTrade(ITrade trade);
        void OnExecutionError(string message);
        void ToConfig();
        void DismissAffirmation();
        void DismissError();
    }
}

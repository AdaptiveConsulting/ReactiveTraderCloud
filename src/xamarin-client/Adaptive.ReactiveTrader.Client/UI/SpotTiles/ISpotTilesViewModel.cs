using System.Collections.ObjectModel;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface ISpotTilesViewModel : IViewModel
    {
        ObservableCollection<ISpotTileViewModel> SpotTiles { get; } 
    }
}

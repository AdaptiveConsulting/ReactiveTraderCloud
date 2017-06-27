using System.Collections.ObjectModel;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTilesViewModel : ViewModelBase, ISpotTilesViewModel
    {
        public DesignTimeSpotTilesViewModel()
        {
            SpotTiles = new ObservableCollection<ISpotTileViewModel>
            {
                new DesignTimeSpotTileViewModel(),
                new DesignTimeSpotTileViewModel(),
                new DesignTimeSpotTileViewModel(),
                new DesignTimeSpotTileViewModel(),
                new DesignTimeSpotTileViewModel()
            };
        }

        public ObservableCollection<ISpotTileViewModel> SpotTiles { get; }
    }
}
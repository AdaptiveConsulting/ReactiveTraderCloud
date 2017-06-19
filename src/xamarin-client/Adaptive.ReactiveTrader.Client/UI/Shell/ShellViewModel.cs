using Adaptive.ReactiveTrader.Client.UI.Blotter;
using Adaptive.ReactiveTrader.Client.UI.Connectivity;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.Shell
{
    [ImplementPropertyChanged]
    public class ShellViewModel : ViewModelBase, IShellViewModel
    {
        public ISpotTilesViewModel SpotTiles { get; private set; }
        public IBlotterViewModel Blotter { get; private set; }
        public IConnectivityStatusViewModel ConnectivityStatus { get; private set; }

        public ShellViewModel(ISpotTilesViewModel spotTiles, IBlotterViewModel blotter, IConnectivityStatusViewModel connectivityStatusViewModel)
        {
            SpotTiles = spotTiles;
            Blotter = blotter;
            ConnectivityStatus = connectivityStatusViewModel;
        }
    }
}

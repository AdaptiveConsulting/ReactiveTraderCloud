using Adaptive.ReactiveTrader.Client.UI.Blotter;
using Adaptive.ReactiveTrader.Client.UI.Connectivity;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.Shell
{
    [AddINotifyPropertyChangedInterface]
    public class ShellViewModel : ViewModelBase, IShellViewModel
    {
        public ISpotTilesViewModel SpotTiles { get; }
        public IBlotterViewModel Blotter { get; }
        public IConnectivityStatusViewModel ConnectivityStatus { get; }

        public ShellViewModel(ISpotTilesViewModel spotTiles, IBlotterViewModel blotter, IConnectivityStatusViewModel connectivityStatusViewModel)
        {
            SpotTiles = spotTiles;
            Blotter = blotter;
            ConnectivityStatus = connectivityStatusViewModel;
        }
    }
}

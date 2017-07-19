using Adaptive.ReactiveTrader.Client.UI.Blotter;
using Adaptive.ReactiveTrader.Client.UI.Connectivity;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.Shell
{
    public interface IShellViewModel : IViewModel
    {
        ISpotTilesViewModel SpotTiles { get; }
        IBlotterViewModel Blotter { get; }
        IConnectivityStatusViewModel ConnectivityStatus { get; }
    }
}

using System.Windows.Input;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface ISpotTileErrorViewModel : IViewModel
    {
        string ErrorMessage { get; }
        ICommand DismissCommand { get; }
    }
}
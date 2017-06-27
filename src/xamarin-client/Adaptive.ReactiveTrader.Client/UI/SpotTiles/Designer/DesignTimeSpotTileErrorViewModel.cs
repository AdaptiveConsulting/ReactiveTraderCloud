using System.Windows.Input;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTileErrorViewModel : ViewModelBase, ISpotTileErrorViewModel
    {
        public string ErrorMessage 
        {
            get
            {
                return "An error occurred while executing the trade. Please check your blotter and if your position is unknown, contact your support representative.";
            }
        }
        public ICommand DismissCommand { get; private set; }
    }
}
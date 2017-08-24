using System.Windows.Input;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public class SpotTileErrorViewModel : ViewModelBase, ISpotTileErrorViewModel
    {
        private readonly ISpotTileViewModel _parent;

        public SpotTileErrorViewModel(ISpotTileViewModel parent, string message)
        {
            _parent = parent;
            ErrorMessage = message;

            DismissCommand = new DelegateCommand(Dismiss);
        }

        private void Dismiss()
        {
            _parent.DismissError();

        }

        public string ErrorMessage { get; }
        public ICommand DismissCommand { get; }
    }
}
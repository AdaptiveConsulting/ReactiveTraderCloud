using System.Windows.Input;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTileConfigViewModel : ViewModelBase, ISpotTileConfigViewModel
    {
        public DesignTimeSpotTileConfigViewModel()
        {
            StandardCommand = new DelegateCommand(() => {}, () => true);
            DropFrameCommand = new DelegateCommand(() => {}, () => true);
            ConflateCommand = new DelegateCommand(() => {}, () => false);
            ConstantRateCommand = new DelegateCommand(() => {}, () => true);
            AsyncCommand = new DelegateCommand(() => { }, () => true);
            SyncCommand = new DelegateCommand(() => { }, () => false);
        }

        public ICommand StandardCommand { get; private set; }
        public ICommand DropFrameCommand { get; private set; }
        public ICommand ConflateCommand { get; private set; }
        public ICommand ConstantRateCommand { get; private set; }
        public ICommand AsyncCommand { get; private set; }
        public ICommand SyncCommand { get; private set; }

        public SpotTileSubscriptionMode SubscriptionMode { get; private set; }
        public SpotTileExecutionMode ExecutionMode { get; private set; }

    }
}
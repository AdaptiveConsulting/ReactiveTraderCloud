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

        public ICommand StandardCommand { get; }
        public ICommand DropFrameCommand { get; }
        public ICommand ConflateCommand { get; }
        public ICommand ConstantRateCommand { get; }
        public ICommand AsyncCommand { get; }
        public ICommand SyncCommand { get; }

        public SpotTileSubscriptionMode SubscriptionMode { get; private set; }
        public SpotTileExecutionMode ExecutionMode { get; private set; }

    }
}
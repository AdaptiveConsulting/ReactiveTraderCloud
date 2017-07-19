using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeOneWayPriceViewModel : ViewModelBase, IOneWayPriceViewModel
    {
        public DesignTimeOneWayPriceViewModel(Direction direction, string bigFigures, string pips, string tenthOfPip)
        {
            Direction = direction;
            BigFigures = bigFigures;
            Pips = pips;
            TenthOfPip = tenthOfPip;
        }

        public Direction Direction { get; }
        public string BigFigures { get; }
        public string Pips { get; }
        public string TenthOfPip { get; }
        public ICommand ExecuteCommand { get; private set; }
        public bool IsExecuting { get; private set; }
        public bool IsStale { get; private set; }
        public SpotTileExecutionMode ExecutionMode { get; set; }

        public void OnPrice(IExecutablePrice executablePrice)
        {
        }

        public void OnStalePrice()
        {
        }
    }
}
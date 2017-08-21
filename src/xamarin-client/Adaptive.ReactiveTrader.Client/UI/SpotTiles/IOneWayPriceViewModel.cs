using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface IOneWayPriceViewModel : IViewModel
    {
        Direction Direction { get; }
        string BigFigures { get; }
        string Pips { get; }
        string TenthOfPip { get; }
        ICommand ExecuteCommand { get; }
        bool IsExecuting { get; }
        void OnPrice(IExecutablePrice executablePrice);
        void OnStalePrice();
        SpotTileExecutionMode ExecutionMode { get; set; }
    }
}

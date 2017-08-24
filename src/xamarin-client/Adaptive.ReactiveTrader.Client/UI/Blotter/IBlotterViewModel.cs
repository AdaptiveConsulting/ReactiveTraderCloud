using System.Collections.ObjectModel;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.Blotter
{
    public interface IBlotterViewModel : IViewModel
    {
        ObservableCollection<ITradeViewModel> Trades { get; } 
    }
}

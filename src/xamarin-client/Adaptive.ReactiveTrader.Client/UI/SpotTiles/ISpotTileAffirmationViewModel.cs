using System;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public interface ISpotTileAffirmationViewModel : IViewModel
    {
        string CurrencyPair { get; }
        Direction Direction { get; }
        long Notional { get; }
        decimal SpotRate { get; }
        string Rejected { get; }
        DateTime TradeDate { get; }
        long TradeId { get; }
        string TraderName { get; }
        DateTime ValueDate { get; }
        ICommand DismissCommand { get; }
        string DealtCurrency { get; }
        string OtherCurrency { get; }
    }
}

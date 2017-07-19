using System;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTileAffirmationViewModel : ViewModelBase, ISpotTileAffirmationViewModel
    {
        public string CurrencyPair => "EUR / USD";
        public Direction Direction => Direction.BUY;
        public long Notional => 1000000;
        public decimal SpotRate => 1.23456m;
        public string Rejected => "REJECTED";
        public DateTime TradeDate => DateTime.Now;
        public long TradeId => 897345;
        public string TraderName => "Olivier";
        public DateTime ValueDate => DateTime.Now.AddDays(2);
        public ICommand DismissCommand => null;
        public string DealtCurrency => "EUR";
        public string OtherCurrency => "USD";
    }
}
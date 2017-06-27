using System;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles.Designer
{
    public class DesignTimeSpotTileAffirmationViewModel : ViewModelBase, ISpotTileAffirmationViewModel
    {
        public string CurrencyPair { get { return "EUR / USD"; } }
        public Direction Direction { get { return Direction.BUY; } }
        public long Notional { get { return 1000000; } }
        public decimal SpotRate { get { return 1.23456m; } }
        public string Rejected { get { return "REJECTED"; } }
        public DateTime TradeDate { get { return DateTime.Now; } }
        public long TradeId { get { return 897345; } }
        public string TraderName { get { return "Olivier"; } }
        public DateTime ValueDate { get { return DateTime.Now.AddDays(2); } }
        public ICommand DismissCommand { get { return null; } }
        public string DealtCurrency { get { return "EUR"; } }
        public string OtherCurrency { get { return "USD"; } }
    }
}
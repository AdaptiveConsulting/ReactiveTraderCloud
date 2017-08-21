using System;
using System.Windows.Input;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    [AddINotifyPropertyChangedInterface]
    public class SpotTileAffirmationViewModel : ViewModelBase, ISpotTileAffirmationViewModel
    {
        private readonly ITrade _trade;
        private readonly ISpotTileViewModel _parent;
        private readonly DelegateCommand _dismissCommand;

        public SpotTileAffirmationViewModel(ITrade trade, ISpotTileViewModel parent)
        {
            _trade = trade;
            _parent = parent;

            _dismissCommand = new DelegateCommand(OnDismissExecute);
        }

        public string CurrencyPair => BaseCurrency + " / " + CounterCurrency;
        public Direction Direction => _trade.Direction;
        public long Notional => _trade.Notional;
        public decimal SpotRate => _trade.SpotRate;
        public DateTime TradeDate => _trade.TradeDate;
        public long TradeId => _trade.TradeId;
        public string TraderName => _trade.TraderName;
        public DateTime ValueDate => _trade.ValueDate;
        public ICommand DismissCommand => _dismissCommand;
        public string DealtCurrency => _trade.DealtCurrency;
        public string Rejected => _trade.TradeStatus == TradeStatus.Done? "":"REJECTED";

        public string OtherCurrency => DealtCurrency == BaseCurrency ? CounterCurrency : BaseCurrency;

        private string BaseCurrency => _trade.CurrencyPair.Substring(0, 3);

        private string CounterCurrency => _trade.CurrencyPair.Substring(3, 3);

        private void OnDismissExecute()
        {
            _parent.DismissAffirmation();
        }
    }
}

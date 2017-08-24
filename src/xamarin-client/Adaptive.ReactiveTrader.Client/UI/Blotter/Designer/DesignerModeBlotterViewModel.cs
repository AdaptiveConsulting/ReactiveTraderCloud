using System;
using System.Collections.ObjectModel;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.Blotter.Designer
{
    public class DesignerModeBlotterViewModel : ViewModelBase, IBlotterViewModel
    {
        public ObservableCollection<ITradeViewModel> Trades { get; }

        public DesignerModeBlotterViewModel()
        {
            Trades = new ObservableCollection<ITradeViewModel>
            {
                new DesignerModeTradeViewModel
                {
                    CurrencyPair = "EUR / USD",
                    Direction = Direction.SELL,
                    Notional = "1,000,000 EUR",
                    SpotRate = 1.23456m,
                    TradeDate = DateTime.Now,
                    ValueDate = DateTime.Now.AddDays(2),
                    TradeId = "12834",
                    TradeStatus = "REJECTED",
                    TraderName = "Olivier"
                },
                new DesignerModeTradeViewModel
                {
                    CurrencyPair = "EUR / USD",
                    Direction = Direction.BUY,
                    Notional = "1,000,000 EUR",
                    SpotRate = 1.23456m,
                    TradeDate = DateTime.Now,
                    ValueDate = DateTime.Now.AddDays(2),
                    TradeId = "12834",
                    TradeStatus = "Done",
                    TraderName = "Olivier"
                },
                new DesignerModeTradeViewModel
                {
                    CurrencyPair = "EUR / USD",
                    Direction = Direction.BUY,
                    Notional = "1,000,000 EUR",
                    SpotRate = 1.23456m,
                    TradeDate = DateTime.Now,
                    ValueDate = DateTime.Now.AddDays(2).AddSeconds(1),
                    TradeId = "12834",
                    TradeStatus = "Done",
                    TraderName = "Olivier"
                }
            };
        }
    }
}
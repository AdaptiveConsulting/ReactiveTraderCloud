using System;
using System.Globalization;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Execution;
using Adaptive.ReactiveTrader.Shared.UI;
using PropertyChanged;

namespace Adaptive.ReactiveTrader.Client.UI.Blotter
{
    [AddINotifyPropertyChangedInterface]
    public class TradeViewModel : ViewModelBase, ITradeViewModel
    {
        private readonly DateTimeOffset _createdTime = DateTimeOffset.UtcNow;
        private readonly bool _isStowTrade;

        public TradeViewModel(ITrade trade, bool isStowTrade)
        {
            _isStowTrade = isStowTrade;
            TradeId = trade.TradeId.ToString(CultureInfo.InvariantCulture);
            CurrencyPair = trade.CurrencyPair.Substring(0, 3) + " / " + trade.CurrencyPair.Substring(3, 3);
            Direction = trade.Direction;
            Notional = trade.Notional.ToString("N0", CultureInfo.InvariantCulture) + " " + trade.DealtCurrency;
            SpotRate = trade.SpotRate;
            TradeDate = trade.TradeDate;
            TradeStatus = trade.TradeStatus == Domain.Models.Execution.TradeStatus.Done ? "Done" : "REJECTED";
            TraderName = trade.TraderName;
            ValueDate = trade.ValueDate;
            DealtCurrency = trade.DealtCurrency;
        }

        public decimal SpotRate { get; }
        public string Notional { get; }
        public Direction Direction { get; }
        public string CurrencyPair { get; }
        public string TradeId { get; }
        public DateTime TradeDate { get; }
        public string TradeStatus { get; }
        public string TraderName { get; }
        public DateTime ValueDate { get; }
        public string DealtCurrency { get; }

        public bool IsNewTrade => !_isStowTrade && _createdTime.AddSeconds(2) > DateTimeOffset.UtcNow;
    }
}

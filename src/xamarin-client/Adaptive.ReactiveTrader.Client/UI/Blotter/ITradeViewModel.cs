using System;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Shared.UI;

namespace Adaptive.ReactiveTrader.Client.UI.Blotter
{
    public interface ITradeViewModel : IViewModel
    {
        decimal SpotRate { get; }
        string Notional { get; }
        Direction Direction { get; }
        string CurrencyPair { get; }
        string TradeId { get; }
        DateTime TradeDate { get; }
        string TradeStatus { get; }
        string TraderName { get; }
        DateTime ValueDate { get; }
        bool IsNewTrade { get; }
    }
}

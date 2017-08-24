using System;

namespace Adaptive.ReactiveTrader.Client.Domain.Models.Execution
{
    public interface ITrade
    {
        string CurrencyPair { get; }
        Direction Direction { get; }
        long Notional { get; }
        decimal SpotRate { get; }
        TradeStatus TradeStatus { get; }
        DateTime TradeDate { get; }
        long TradeId { get; }
        string TraderName { get; }
        DateTime ValueDate { get; }
        string DealtCurrency { get; }
    }
}
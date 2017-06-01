namespace Adaptive.ReactiveTrader.Contract.Events.CreditAccount
{
    public class CreditLimitBreachedEvent
    {
        public CreditLimitBreachedEvent(string tradeId)
        {
            TradeId = tradeId;
        }

        public string TradeId { get; }
    }
}
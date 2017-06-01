namespace Adaptive.ReactiveTrader.Contract.Events.Trade
{
    public class TradeCompletedEvent
    {
        public TradeCompletedEvent(string tradeId)
        {
            TradeId = tradeId;
        }

        public string TradeId { get; }
    }
}
namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairDeactivatedEvent
    {
        public CurrencyPairDeactivatedEvent(string symbol)
        {
            Symbol = symbol;
        }

        public string Symbol { get; }
    }
}
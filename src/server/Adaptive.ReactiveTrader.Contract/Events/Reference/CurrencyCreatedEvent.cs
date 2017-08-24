namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyCreatedEvent
    {
        public CurrencyCreatedEvent(string symbol)
        {
            Symbol = symbol;
        }

        public string Symbol { get; }
    }
}
namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairActivatedEvent
    {
        public CurrencyPairActivatedEvent(string symbol)
        {
            Symbol = symbol;
        }

        public string Symbol { get; }
    }
}
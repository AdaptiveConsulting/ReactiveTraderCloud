namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairActivatedEvent
    {
        public string Symbol { get; }
        public string Name { get; } = "Currency Pair Activated";

        public CurrencyPairActivatedEvent(string symbol)
        {
            Symbol = symbol;
        }
    }
}
namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairDeactivatedEvent
    {
        public string Symbol { get; }
        public string Name { get; } = "Currency Pair Deactivated";

        public CurrencyPairDeactivatedEvent(string symbol)
        {
            Symbol = symbol;
        }
    }
}
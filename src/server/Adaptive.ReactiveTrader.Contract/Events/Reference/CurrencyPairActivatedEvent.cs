namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairActivatedEvent
    {
        public CurrencyPairActivatedEvent(string symbol)
        {
            Symbol = symbol;
        }

        public static string Type { get; } = "Currency Pair Activated";
        public string Symbol { get; }
    }
}
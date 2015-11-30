namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairActivatedEvent
    {
        public static string Type { get; } = "Currency Pair Activated";
        public string Symbol { get; }

        public CurrencyPairActivatedEvent(string symbol)
        {
            Symbol = symbol;
        }
    }
}
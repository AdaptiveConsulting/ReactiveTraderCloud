namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencyPairDeactivatedEvent
    {
        public static string Type { get; } = "Currency Pair Deactivated";
        public string Symbol { get; }

        public CurrencyPairDeactivatedEvent(string symbol)
        {
            Symbol = symbol;
        }
    }
}
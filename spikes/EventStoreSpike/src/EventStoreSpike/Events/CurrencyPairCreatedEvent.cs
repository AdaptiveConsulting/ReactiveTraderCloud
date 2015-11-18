namespace EventStoreSpike
{
    public class CurrencyPairCreatedEvent
    {
        public string Symbol { get; }
        public decimal DealableLimit { get; }
        public string Name { get; } = "Currency Pair Created";

        public CurrencyPairCreatedEvent(string symbol, decimal dealableLimit)
        {
            Symbol = symbol;
            DealableLimit = dealableLimit;
        }
    }
}
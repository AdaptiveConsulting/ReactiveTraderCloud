namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencySetDealableEvent
    {
        public CurrencySetDealableEvent(string symbol)
        {
            Symbol = symbol;
        }

        public string Symbol { get; }
    }
}
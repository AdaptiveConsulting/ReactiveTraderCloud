namespace Adaptive.ReactiveTrader.Contract.Events.Reference
{
    public class CurrencySetNotDealableEvent
    {
        public CurrencySetNotDealableEvent(string symbol)
        {
            Symbol = symbol;
        }

        public string Symbol { get; }
    }
}
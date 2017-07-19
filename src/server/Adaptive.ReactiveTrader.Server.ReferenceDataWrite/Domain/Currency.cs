using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain
{
    public class Currency : AggregateBase
    {
        public Currency()
        {
        }

        public Currency(string symbol)
        {
            if (IsCreated)
            {
                return;
            }

            RaiseEvent(new CurrencyCreatedEvent(symbol));
        }

        public override object Identifier => $"ccy-{Symbol}";
        public string Symbol { get; private set; }
        public bool IsDealable { get; private set; }
        private bool IsCreated { get; set; }

        public void SetDealability(bool targetIsDealable)
        {
            if (!IsCreated || IsDealable == targetIsDealable)
            {
                return;
            }

            if (targetIsDealable)
            {
                RaiseEvent(new CurrencySetDealableEvent(Symbol));
            }
            else
            {
                RaiseEvent(new CurrencySetNotDealableEvent(Symbol));
            }
        }

        public void Apply(CurrencyCreatedEvent evt)
        {
            Symbol = evt.Symbol;
            IsCreated = true;
        }

        public void Apply(CurrencySetDealableEvent evt)
        {
            IsDealable = true;
        }

        public void Apply(CurrencySetNotDealableEvent evt)
        {
            IsDealable = false;
        }
    }
}
using Adaptive.ReactiveTrader.Contract.Events.Reference;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite.Domain
{
    public class CurrencyPair : AggregateBase
    {
        public override object Identifier => $"ccyPair-{Symbol}";
        private string Symbol { get; set; }
        private int PipsPosition { get; set; }
        private int RatePrecision { get; set; }
        private decimal SampleRate { get; set; }
        private string Comment { get; set; }
        public bool IsActive { get; private set; }
        private bool IsCreated { get; set; }

        public CurrencyPair()
        {
        }

        public CurrencyPair(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment)
        {
            if (IsCreated)
            {
                return;
            }

            RaiseEvent(new CurrencyPairCreatedEvent(symbol, pipsPosition, ratePrecision, sampleRate, comment));
        }

        public void Activate()
        {
            if (IsActive || !IsCreated)
            {
                return;
            }

            RaiseEvent(new CurrencyPairActivatedEvent(Symbol));
        }

        public void Deactivate()
        {
            if (!IsActive || !IsCreated)
            {
                return;
            }

            IsActive = false;
            RaiseEvent(new CurrencyPairDeactivatedEvent(Symbol));
        }

        public void Apply(CurrencyPairCreatedEvent evt)
        {
            Symbol = evt.Symbol;
            PipsPosition = evt.PipsPosition;
            RatePrecision = evt.RatePrecision;
            SampleRate = evt.SampleRate;
            Comment = evt.Comment;
            IsCreated = true;
        }

        public void Apply(CurrencyPairActivatedEvent evt)
        {
            IsActive = true;
        }

        public void Apply(CurrencyPairDeactivatedEvent evt)
        {
            IsActive = false;
        }
    }
}
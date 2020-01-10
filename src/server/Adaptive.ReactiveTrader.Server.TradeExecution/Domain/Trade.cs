using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class Trade : AggregateBase
    {
        public Trade()
        {
        }

        public Trade(long id,
                     string userName,
                     string currencyPair,
                     decimal spotRate,
                     DateTimeOffset tradeDate,
                     DateTimeOffset valueDate,
                     DirectionDto direction,
                     decimal notional,
                     string dealtCurrency)
        {
            RaiseEvent(new TradeCreatedEvent(id,
                                             userName,
                                             currencyPair,
                                             spotRate,
                                             tradeDate,
                                             valueDate,
                                             direction.ToString(),
                                             notional,
                                             dealtCurrency));
        }

        public override object Identifier => $"trade-{Id}";

        public long Id { get; private set; }
        public string TraderName { get; private set; }
        public string CurrencyPair { get; private set; }
        public decimal SpotRate { get; private set; }
        public DateTimeOffset TradeDate { get; private set; }
        public DateTimeOffset ValueDate { get; private set; }
        public DirectionDto Direction { get; private set; }
        public decimal Notional { get; private set; }
        public string DealtCurrency { get; private set; }
        public string RejectReason { get; private set; }
        public TradeStatusDto State { get; private set; }

        public void Reject(string reason)
        {
            RaiseEvent(new TradeRejectedEvent(Id, reason));
        }

        public void Complete()
        {
            RaiseEvent(new TradeCompletedEvent(Id));
        }

        public void Apply(TradeCreatedEvent evt)
        {
            Id = evt.TradeId;
            TraderName = evt.TraderName;
            CurrencyPair = evt.CurrencyPair;
            SpotRate = evt.SpotRate;
            TradeDate = evt.TradeDate;
            ValueDate = evt.ValueDate;
            Direction = (DirectionDto) Enum.Parse(typeof (DirectionDto), evt.Direction);
            Notional = evt.Notional;
            DealtCurrency = evt.DealtCurrency;
            State = TradeStatusDto.Pending;
        }

        public void Apply(TradeRejectedEvent evt)
        {
            RejectReason = evt.Reason;
            State = TradeStatusDto.Rejected;
        }

        public void Apply(TradeCompletedEvent evt)
        {
            State = TradeStatusDto.Done;
        }
    }
}

using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Process;
using Adaptive.ReactiveTrader.Server.TradeExecution.CommandHandlers;
using Adaptive.ReactiveTrader.Server.TradeExecution.Commands;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class TradeExecutionProcess : ProcessBase
    {
        private readonly ReserveCreditCommandHandler _reserveCreditCommandHandler;
        private readonly CompleteTradeCommandHandler _completeTradeCommandHandler;
        private readonly RejectTradeCommandHandler _rejectTradeCommandHandler;

        public TradeExecutionProcess(ReserveCreditCommandHandler reserveCreditCommandHandler,
                                     CompleteTradeCommandHandler completeTradeCommandHandler,
                                     RejectTradeCommandHandler rejectTradeCommandHandler)
        {
            _reserveCreditCommandHandler = reserveCreditCommandHandler;
            _completeTradeCommandHandler = completeTradeCommandHandler;
            _rejectTradeCommandHandler = rejectTradeCommandHandler;
        }

        public override string StreamPrefix { get; } = "tradeExecution-";
        public override string Identifier => $"{StreamPrefix}{TradeId}";
        public string TradeId { get; private set; }

        public void OnEvent(TradeCreatedEvent @event)
        {
            TradeId = @event.TradeId;

            var direction = (DirectionDto)Enum.Parse(typeof(DirectionDto), @event.Direction);
            var tradeDetails = new TradeDetails(@event.TradeId,
                                                @event.CurrencyPair,
                                                @event.SpotRate,
                                                @event.TradeDate,
                                                @event.ValueDate,
                                                direction,
                                                @event.Notional,
                                                @event.DealtCurrency);

            var command = new ReserveCreditCommand(@event.TraderName, tradeDetails);

            AddMessageToDispatch(() => _reserveCreditCommandHandler.HandleAsync(command));
        }

        public void OnEvent(CreditReservedEvent @event)
        {
            var command = new CompleteTradeCommand(@event.TradeId);
            AddMessageToDispatch(() => _completeTradeCommandHandler.HandleAsync(command));
        }

        public void OnEvent(CreditLimitBreachedEvent @event)
        {
            var command = new RejectTradeCommand(@event.TradeId, "Credit limit breached.");
            AddMessageToDispatch(() => _rejectTradeCommandHandler.HandleAsync(command));
        }
    }
}
using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Process;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class TradeExecutionProcess : ProcessBase
    {
        private readonly IReserveCreditCommandHandler _reserveCreditCommandHandler;
        private readonly ICompleteTradeCommandHandler _completeTradeCommandHandler;
        private readonly IRejectTradeCommandHandler _rejectTradeCommandHandler;

        public TradeExecutionProcess()
        {
        }

        public TradeExecutionProcess(
            IReserveCreditCommandHandler reserveCreditCommandHandler,
            ICompleteTradeCommandHandler completeTradeCommandHandler,
            IRejectTradeCommandHandler rejectTradeCommandHandler)
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
            var command = new ReserveCreditCommand(@event.TraderName, @event.TradeId);
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
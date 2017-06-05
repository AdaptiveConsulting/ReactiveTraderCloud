using System;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.EventStore.Process;
using Adaptive.ReactiveTrader.Server.TradeExecution.Commands;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Domain
{
    public class TradeExecutionProcess : ProcessBase
    {
        private readonly IAggregateRepository _repository;
        private bool _isComplete;

        public TradeExecutionProcess(IAggregateRepository repository)
        {
            _repository = repository;
            RegisterRoute<TradeCreatedEvent>(OnEvent);
            RegisterRoute<CreditReservedEvent>(OnEvent);
            RegisterRoute<CreditLimitBreachedEvent>(OnEvent);
            RegisterRoute<TradeCompletedEvent>(OnEvent);
            RegisterRoute<TradeRejectedEvent>(OnEvent);
        }

        public override string StreamPrefix { get; } = "tradeExecution-";
        public override string Identifier => $"{StreamPrefix}{TradeId}";
        public string TradeId { get; private set; }

        private void OnEvent(TradeCreatedEvent @event)
        {
            if (_isComplete) return;

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

            AddMessageToDispatch(() => CommandHandlers.HandleAsync(command, _repository));
        }

        private void OnEvent(CreditReservedEvent @event)
        {
            if (_isComplete) return;
            var command = new CompleteTradeCommand(@event.TradeId);
            AddMessageToDispatch(() => CommandHandlers.HandleAsync(command, _repository));
        }

        private void OnEvent(CreditLimitBreachedEvent @event)
        {
            if (_isComplete) return;
            var command = new RejectTradeCommand(@event.TradeId, "Credit limit breached.");
            AddMessageToDispatch(() => CommandHandlers.HandleAsync(command, _repository));
        }

        private void OnEvent(TradeCompletedEvent @event)
        {
            if (_isComplete) return;
            _isComplete = true;
        }

        private void OnEvent(TradeRejectedEvent @event)
        {
            if (_isComplete) return;
            _isComplete = true;
        }
    }
}
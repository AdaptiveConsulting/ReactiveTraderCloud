using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.EventHandling;
using Adaptive.ReactiveTrader.EventStore.Process;
using Adaptive.ReactiveTrader.Server.TradeExecution.Domain;

namespace Adaptive.ReactiveTrader.Server.TradeExecution
{
    public class TradeExecutionEventHandler : IEventHandler<TradeCreatedEvent>,
                                              IEventHandler<CreditReservedEvent>,
                                              IEventHandler<CreditLimitBreachedEvent>,
                                              IEventHandler<TradeCompletedEvent>,
                                              IEventHandler<TradeRejectedEvent>,
                                              IDisposable
    {
        private readonly IProcessFactory _processFactory;
        private readonly IProcessRepository _processRepository;

        public TradeExecutionEventHandler(IProcessFactory processFactory, IProcessRepository processRepository)
        {
            _processFactory = processFactory;
            _processRepository = processRepository;
        }

        public void Dispose()
        {
            // Nothing to do
        }

        public async Task Handle(TradeCreatedEvent @event)
        {
            var process = _processFactory.Create<TradeExecutionProcess>();
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(CreditReservedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>(@event.TradeId);
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(CreditLimitBreachedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>(@event.TradeId);
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(TradeCompletedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>(@event.TradeId);
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(TradeRejectedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>(@event.TradeId);
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }
    }
}
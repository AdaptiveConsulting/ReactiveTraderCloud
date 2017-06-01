using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract.Events.CreditAccount;
using Adaptive.ReactiveTrader.Contract.Events.Trade;
using Adaptive.ReactiveTrader.EventStore.EventHandling;
using Adaptive.ReactiveTrader.EventStore.Process;

namespace Adaptive.ReactiveTrader.Server.TradeExecution.Process
{
    public class TradeExecutionEventHandler : IEventHandler<TradeCreatedEvent>, IEventHandler<CreditReservedEvent>,
        IEventHandler<CreditLimitBreachedEvent>, IDisposable
    {
        private readonly IProcessRepository _processRepository;

        public TradeExecutionEventHandler(IProcessRepository processRepository)
        {
            _processRepository = processRepository;
        }

        public void Dispose()
        {
            // Nothing to do
        }

        public async Task Handle(TradeCreatedEvent @event)
        {
            var process = new TradeExecutionProcess();
            process.Transition((object)@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(CreditReservedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>("TODO");
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }

        public async Task Handle(CreditLimitBreachedEvent @event)
        {
            var process = await _processRepository.GetByIdAsync<TradeExecutionProcess>("TODO");
            process.Transition(@event);
            await _processRepository.SaveAsync(process);
        }
    }
}
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
    }
}
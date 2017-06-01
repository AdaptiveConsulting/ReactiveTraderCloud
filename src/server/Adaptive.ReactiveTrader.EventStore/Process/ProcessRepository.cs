using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore.Domain;
using EventStore.ClientAPI;
using Serilog;
using Serilog.Events;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public class ProcessRepository : RepositoryBase, IProcessRepository, IDisposable
    {
        public ProcessRepository(IEventStoreConnection eventStoreConnection,
                                 EventTypeResolver eventTypeResolver) : base(eventStoreConnection, eventTypeResolver)
        {
        }

        public void Dispose()
        {
            // Nothing to do
        }

        public async Task<TProcess> GetByIdAsync<TProcess>(object id) where TProcess : class, IProcess, new()
        {
            var process = new TProcess();
            var streamName = $"{process.Identifier}{id}";

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Loading process {streamName} from Event Store", streamName);
            }

            var result = await ReadEventsAsync(streamName, e => process.Transition(e));

            if (result == SliceReadStatus.StreamNotFound)
            {
                throw new AggregateNotFoundException(id, typeof(TProcess));
            }

            if (result == SliceReadStatus.StreamDeleted)
            {
                throw new AggregateDeletedException(id, typeof(TProcess));
            }

            return process;
        }

        public async Task<int> SaveAsync(IProcess process, params KeyValuePair<string, string>[] extraHeaders)
        {
            var streamName = process.Identifier.ToString();
            var events = process.GetUncommittedEvents();
            var expectedVersion = process.Version - events.Count;
            var commitId = Guid.NewGuid().ToString();

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Saving process {streamName}", streamName);
            }

            var result = await WriteEventsAsync(streamName, expectedVersion, events, extraHeaders, commitId);

            await process.DispatchMessages();

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Process {streamName} messages dispatched", streamName);
            }

            process.ClearUncommittedEvents();
            process.ClearUndispatchedMessages();

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Process {streamName} uncommitted events cleaned up", streamName);
                Log.Information("Process {streamName} undispatched messages cleaned up", streamName);
            }

            return result.NextExpectedVersion;
        }
    }
}
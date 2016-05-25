using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Newtonsoft.Json;
using Serilog.Events;
using ILogger = Serilog.ILogger;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public class Repository : IRepository, IDisposable
    {
        private const int WritePageSize = 500;
        private const int ReadPageSize = 500;
        private static readonly ILogger Log = Log.ForContext<Repository>();
        private static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings {TypeNameHandling = TypeNameHandling.None};
        private readonly IEventStoreConnection _eventStoreConnection;
        private readonly EventTypeResolver _eventTypeResolver;

        public Repository(IEventStoreConnection eventStoreConnection, EventTypeResolver eventTypeResolver)
        {
            _eventStoreConnection = eventStoreConnection;
            _eventTypeResolver = eventTypeResolver;
        }

        public void Dispose()
        {
            Log.Warning("Not Disposing.");
        }

        public async Task<TAggregate> GetById<TAggregate>(object id) where TAggregate : IAggregate, new()
        {
            var aggregate = new TAggregate();

            var streamName = $"{aggregate.Identifier}{id}";

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Loading aggregate {streamName} from Event Store", streamName);
            }

            var eventNumber = 0;
            StreamEventsSlice currentSlice;
            do
            {
                currentSlice = await _eventStoreConnection.ReadStreamEventsForwardAsync(streamName, eventNumber, ReadPageSize, false);

                if (currentSlice.Status == SliceReadStatus.StreamNotFound)
                {
                    throw new AggregateNotFoundException(id, typeof (TAggregate));
                }

                if (currentSlice.Status == SliceReadStatus.StreamDeleted)
                {
                    throw new AggregateDeletedException(id, typeof (TAggregate));
                }

                eventNumber = currentSlice.NextEventNumber;

                foreach (var resolvedEvent in currentSlice.Events)
                {
                    var payload = DeserializeEvent(resolvedEvent.Event);
                    aggregate.ApplyEvent(payload);
                }
            } while (!currentSlice.IsEndOfStream);

            return aggregate;
        }

        public async Task<int> SaveAsync(AggregateBase aggregate, params KeyValuePair<string, string>[] extraHeaders)
        {
            var streamName = aggregate.Identifier.ToString();

            if (Log.IsEnabled(LogEventLevel.Information))
            {
                Log.Information("Saving aggregate {streamName}", streamName);
            }

            var pendingEvents = aggregate.GetPendingEvents();
            var originalVersion = aggregate.Version - pendingEvents.Count;

            try
            {
                WriteResult result;

                var commitHeaders = CreateCommitHeaders(aggregate, extraHeaders);
                var eventsToSave = pendingEvents.Select(x => ToEventData(Guid.NewGuid(), x, commitHeaders));

                if (Log.IsEnabled(LogEventLevel.Information))
                {
                    Log.Information("{pendingEventsCount} events to write to stream {streamName}...", pendingEvents.Count, streamName);
                }

                if (Log.IsEnabled(LogEventLevel.Debug))
                {
                    foreach (var evt in pendingEvents)
                    {
                        // Take the hit of serializing twice here as debug logging should only be on in exceptional circumstances
                        Log.Debug("Event Type: {eventType}. Payload: {payload}", evt.GetType().Name, JsonConvert.SerializeObject(evt));
                    }
                }

                var eventBatches = GetEventBatches(eventsToSave);
                Debug.Assert(eventBatches.Count > 0);

                if (eventBatches.Count == 1)
                {
                    // If just one batch write them straight to the Event Store
                    result = await _eventStoreConnection.AppendToStreamAsync(streamName, originalVersion, eventBatches[0]);
                }
                else
                {
                    // If we have more events to save than can be done in one batch according to the WritePageSize, then we need to save them in a transaction to ensure atomicity
                    using (var transaction = await _eventStoreConnection.StartTransactionAsync(streamName, originalVersion))
                    {
                        if (Log.IsEnabled(LogEventLevel.Information))
                        {
                            Log.Information("Started transaction {transactionId} for stream {streamName}", transaction.TransactionId, streamName);
                        }

                        foreach (var batch in eventBatches)
                        {
                            await transaction.WriteAsync(batch);
                        }

                        result = await transaction.CommitAsync();

                        if (Log.IsEnabled(LogEventLevel.Information))
                        {
                            Log.Information("Transaction {transactionId} committed", transaction.TransactionId);
                        }
                    }
                }

                aggregate.ClearPendingEvents();

                if (Log.IsEnabled(LogEventLevel.Information))
                {
                    Log.Information("Aggregate {streamName} pending events cleaned up", streamName);
                }

                return result.NextExpectedVersion;
            }
            catch (Exception ex)
            {
                Log.Error($"Failed to write events for stream: {streamName}.", ex);
                ExceptionDispatchInfo.Capture(ex).Throw();
            }

            return originalVersion + 1;
        }

        private object DeserializeEvent(RecordedEvent evt)
        {
            var targetType = _eventTypeResolver.GetTypeForEventName(evt.EventType);
            var json = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject(json, targetType);
        }
        
        private IList<IList<EventData>> GetEventBatches(IEnumerable<EventData> events)
        {
            return events.Batch(WritePageSize).Select(x => (IList<EventData>) x.ToList()).ToList();
        }

        private static IDictionary<string, string> CreateCommitHeaders(AggregateBase aggregate, KeyValuePair<string, string>[] extraHeaders)
        {
            var commitId = Guid.NewGuid();

            var commitHeaders = new Dictionary<string, string>
            {
                {MetadataKeys.CommitIdHeader, commitId.ToString()},
                {MetadataKeys.AggregateClrTypeHeader, aggregate.GetType().AssemblyQualifiedName},
                {MetadataKeys.UserIdentityHeader, Thread.CurrentThread.Name}, // TODO - was Thread.CurrentPrincipal?.Identity?.Name
                {MetadataKeys.ServerNameHeader, "DefaultServerNameHEader"}, // TODO - was Environment.MachineName
                {MetadataKeys.ServerClockHeader, DateTime.UtcNow.ToString("o")}
            };

            foreach (var extraHeader in extraHeaders)
            {
                commitHeaders[extraHeader.Key] = extraHeader.Value;
            }

            return commitHeaders;
        }

        private static EventData ToEventData(Guid eventId, object evnt, IDictionary<string, string> headers)
        {
            var data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(evnt, SerializerSettings));

            var eventHeaders = new Dictionary<string, string>(headers)
            {
                {MetadataKeys.EventClrTypeHeader, evnt.GetType().AssemblyQualifiedName}
            };
            var metadata = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(eventHeaders, SerializerSettings));
            var typeName = evnt.GetType().Name;

            return new EventData(eventId, typeName, true, data, metadata);
        }
    }
}
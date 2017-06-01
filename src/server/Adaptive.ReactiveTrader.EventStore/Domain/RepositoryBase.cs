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
using Serilog;
using Serilog.Events;

namespace Adaptive.ReactiveTrader.EventStore.Domain
{
    public abstract class RepositoryBase
    {
        private const int ReadPageSize = 500;
        private const int WritePageSize = 500;
        private static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.None };
        private readonly IEventStoreConnection _eventStoreConnection;
        private readonly EventTypeResolver _eventTypeResolver;

        protected RepositoryBase(IEventStoreConnection eventStoreConnection, EventTypeResolver eventTypeResolver)
        {
            _eventStoreConnection = eventStoreConnection;
            _eventTypeResolver = eventTypeResolver;
        }

        protected async Task<SliceReadStatus> ReadEventsAsync(string streamName, Action<object> onEventRead)
        {
            var eventNumber = 0;
            StreamEventsSlice currentSlice;
            do
            {
                currentSlice = await _eventStoreConnection.ReadStreamEventsForwardAsync(streamName, eventNumber, ReadPageSize, false);

                if (currentSlice.Status != SliceReadStatus.Success)
                {
                    return currentSlice.Status;
                }

                eventNumber = currentSlice.NextEventNumber;

                foreach (var resolvedEvent in currentSlice.Events)
                {
                    var payload = DeserializeEvent(resolvedEvent.Event);
                    onEventRead(payload);
                }
            } while (!currentSlice.IsEndOfStream);

            return SliceReadStatus.Success;
        }

        protected async Task<WriteResult> WriteEventsAsync(string streamName,
                                                           int expectedVersion,
                                                           IEnumerable<object> events,
                                                           IEnumerable<KeyValuePair<string, string>> extraHeaders,
                                                           string commitId)
        {
            try
            {
                WriteResult result;
                var commitHeaders = CreateCommitHeaders(commitId, extraHeaders);
                var eventList = events as IReadOnlyList<object> ?? events.ToList();
                var eventsToSave = eventList.Select(x => ToEventData(Guid.NewGuid(), x, commitHeaders));

                if (Log.IsEnabled(LogEventLevel.Information))
                {
                    Log.Information("{pendingEventsCount} events to write to stream {streamName}...", eventList.Count, streamName);
                }

                if (Log.IsEnabled(LogEventLevel.Debug))
                {
                    foreach (var evt in eventList)
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
                    result = await _eventStoreConnection.AppendToStreamAsync(streamName, expectedVersion, eventBatches[0]);
                }
                else
                {
                    // If we have more events to save than can be done in one batch according to the WritePageSize, then we need to save them in a transaction to ensure atomicity
                    using (var transaction = await _eventStoreConnection.StartTransactionAsync(streamName, expectedVersion))
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

                return result;
            }
            catch (Exception ex)
            {
                Log.Error($"Failed to write events for stream: {streamName}.", ex);
                ExceptionDispatchInfo.Capture(ex).Throw();
            }

            // Should never get here.
            return new WriteResult();
        }

        private object DeserializeEvent(RecordedEvent evt)
        {
            var targetType = _eventTypeResolver.GetTypeForEventName(evt.EventType);
            var json = Encoding.UTF8.GetString(evt.Data);
            return JsonConvert.DeserializeObject(json, targetType);
        }

        private static IDictionary<string, string> CreateCommitHeaders(string commitId, IEnumerable<KeyValuePair<string, string>> extraHeaders)
        {
            var commitHeaders = new Dictionary<string, string>
            {
                { MetadataKeys.CommitIdHeader, commitId },
                { MetadataKeys.UserIdentityHeader, Thread.CurrentThread.Name }, // TODO - was Thread.CurrentPrincipal?.Identity?.Name
                { MetadataKeys.ServerNameHeader, "DefaultServerNameHeader" }, // TODO - was Environment.MachineName
                { MetadataKeys.ServerClockHeader, DateTime.UtcNow.ToString("o") }
            };

            foreach (var extraHeader in extraHeaders)
            {
                commitHeaders[extraHeader.Key] = extraHeader.Value;
            }

            return commitHeaders;
        }

        private static EventData ToEventData(Guid eventId, object @event, IDictionary<string, string> headers)
        {
            var data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(@event, SerializerSettings));

            var eventHeaders = new Dictionary<string, string>(headers)
            {
                { MetadataKeys.EventClrTypeHeader, @event.GetType().AssemblyQualifiedName }
            };

            var metadata = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(eventHeaders, SerializerSettings));
            var typeName = @event.GetType().Name;

            return new EventData(eventId, typeName, true, data, metadata);
        }

        private static IList<IList<EventData>> GetEventBatches(IEnumerable<EventData> events)
        {
            return events.Batch(WritePageSize).Select(x => (IList<EventData>)x.ToList()).ToList();
        }
    }
}
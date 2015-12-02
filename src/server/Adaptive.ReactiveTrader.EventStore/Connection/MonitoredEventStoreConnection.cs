using EventStore.ClientAPI;
using EventStore.ClientAPI.SystemData;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Connection
{
    public interface IMonitoredEventStoreConnection : IEventStoreConnection
    {
        IObservable<ConnectionInfo> ConnectionStatusChanged { get; }
    }

    public class MonitoredEventStoreConnection : IMonitoredEventStoreConnection
    {
        private readonly IEventStoreConnection _connection;
        private readonly ConnectionStatusMonitor _monitor;

        public MonitoredEventStoreConnection(IEventStoreConnection connection)
        {
            _monitor = new ConnectionStatusMonitor(connection);
            _connection = connection;
        }

        public IObservable<ConnectionInfo> ConnectionStatusChanged => _monitor.ConnectionStatusChanged;
        public string ConnectionName => _connection.ConnectionName;

        public Task ConnectAsync()
        {
            return _connection.ConnectAsync();
        }

        public void Close()
        {
            _connection.Close();
        }

        public Task<DeleteResult> DeleteStreamAsync(string stream, int expectedVersion, UserCredentials userCredentials = null)
        {
            return _connection.DeleteStreamAsync(stream, expectedVersion, userCredentials);
        }

        public Task<DeleteResult> DeleteStreamAsync(string stream, int expectedVersion, bool hardDelete, UserCredentials userCredentials = null)
        {
            return _connection.DeleteStreamAsync(stream, expectedVersion, hardDelete, userCredentials);
        }

        public Task<WriteResult> AppendToStreamAsync(string stream, int expectedVersion, params EventData[] events)
        {
            return _connection.AppendToStreamAsync(stream, expectedVersion, events);
        }

        public Task<WriteResult> AppendToStreamAsync(string stream, int expectedVersion, UserCredentials userCredentials, params EventData[] events)
        {
            return _connection.AppendToStreamAsync(stream, expectedVersion, userCredentials, events);
        }

        public Task<WriteResult> AppendToStreamAsync(string stream, int expectedVersion, IEnumerable<EventData> events, UserCredentials userCredentials = null)
        {
            return _connection.AppendToStreamAsync(stream, expectedVersion, events, userCredentials);
        }

        public Task<EventStoreTransaction> StartTransactionAsync(string stream, int expectedVersion, UserCredentials userCredentials = null)
        {
            return _connection.StartTransactionAsync(stream, expectedVersion, userCredentials);
        }

        public EventStoreTransaction ContinueTransaction(long transactionId, UserCredentials userCredentials = null)
        {
            return _connection.ContinueTransaction(transactionId, userCredentials);
        }

        public Task<EventReadResult> ReadEventAsync(string stream, int eventNumber, bool resolveLinkTos, UserCredentials userCredentials = null)
        {
            return _connection.ReadEventAsync(stream, eventNumber, resolveLinkTos, userCredentials);
        }

        public Task<StreamEventsSlice> ReadStreamEventsForwardAsync(string stream, int start, int count, bool resolveLinkTos, UserCredentials userCredentials = null)
        {
            return _connection.ReadStreamEventsForwardAsync(stream, start, count, resolveLinkTos, userCredentials);
        }

        public Task<StreamEventsSlice> ReadStreamEventsBackwardAsync(string stream, int start, int count, bool resolveLinkTos, UserCredentials userCredentials = null)
        {
            return _connection.ReadStreamEventsBackwardAsync(stream, start, count, resolveLinkTos, userCredentials);
        }

        public Task<AllEventsSlice> ReadAllEventsForwardAsync(Position position, int maxCount, bool resolveLinkTos, UserCredentials userCredentials = null)
        {
            return _connection.ReadAllEventsForwardAsync(position, maxCount, resolveLinkTos, userCredentials);
        }

        public Task<AllEventsSlice> ReadAllEventsBackwardAsync(Position position, int maxCount, bool resolveLinkTos, UserCredentials userCredentials = null)
        {
            return _connection.ReadAllEventsBackwardAsync(position, maxCount, resolveLinkTos, userCredentials);
        }

        public Task<EventStoreSubscription> SubscribeToStreamAsync(string stream,
                                           bool resolveLinkTos,
                                           Action<EventStoreSubscription, ResolvedEvent> eventAppeared,
                                           Action<EventStoreSubscription, SubscriptionDropReason, Exception> subscriptionDropped = null,
                                           UserCredentials userCredentials = null)
        {
            return _connection.SubscribeToStreamAsync(stream, resolveLinkTos, eventAppeared, subscriptionDropped, userCredentials);
        }

        public EventStoreStreamCatchUpSubscription SubscribeToStreamFrom(string stream,
                                                                         int? lastCheckpoint,
                                                                         bool resolveLinkTos,
                                                                         Action<EventStoreCatchUpSubscription, ResolvedEvent> eventAppeared,
                                                                         Action<EventStoreCatchUpSubscription> liveProcessingStarted = null,
                                                                         Action<EventStoreCatchUpSubscription, SubscriptionDropReason, Exception> subscriptionDropped = null,
                                                                         UserCredentials userCredentials = null,
                                                                         int readBatchSize = 500)
        {
            return _connection.SubscribeToStreamFrom(stream, lastCheckpoint, resolveLinkTos, eventAppeared, liveProcessingStarted, subscriptionDropped, userCredentials, readBatchSize);
        }

        public Task<EventStoreSubscription> SubscribeToAllAsync(bool resolveLinkTos, Action<EventStoreSubscription, ResolvedEvent> eventAppeared, Action<EventStoreSubscription, SubscriptionDropReason, Exception> subscriptionDropped = null, UserCredentials userCredentials = null)
        {
            return _connection.SubscribeToAllAsync(resolveLinkTos, eventAppeared, subscriptionDropped, userCredentials);
        }

        public EventStorePersistentSubscriptionBase ConnectToPersistentSubscription(string stream,
                                                                                    string groupName,
                                                                                    Action<EventStorePersistentSubscriptionBase, ResolvedEvent> eventAppeared,
                                                                                    Action<EventStorePersistentSubscriptionBase, SubscriptionDropReason, Exception> subscriptionDropped = null,
                                                                                    UserCredentials userCredentials = null,
                                                                                    int bufferSize = 10,
                                                                                    bool autoAck = true)
        {
            return _connection.ConnectToPersistentSubscription(stream,
                                                               groupName,
                                                               eventAppeared,
                                                               subscriptionDropped,
                                                               userCredentials,
                                                               bufferSize,
                                                               autoAck);
        }

        public EventStoreAllCatchUpSubscription SubscribeToAllFrom(Position? lastCheckpoint,
                                                                   bool resolveLinkTos,
                                                                   Action<EventStoreCatchUpSubscription, ResolvedEvent> eventAppeared,
                                                                   Action<EventStoreCatchUpSubscription> liveProcessingStarted = null,
                                                                   Action<EventStoreCatchUpSubscription, SubscriptionDropReason, Exception> subscriptionDropped = null,
                                                                   UserCredentials userCredentials = null,
                                                                   int readBatchSize = 500)
        {
            return _connection.SubscribeToAllFrom(lastCheckpoint,
                                                  resolveLinkTos,
                                                  eventAppeared,
                                                  liveProcessingStarted,
                                                  subscriptionDropped,
                                                  userCredentials,
                                                  readBatchSize);
        }

        public Task UpdatePersistentSubscriptionAsync(string stream, string groupName, PersistentSubscriptionSettings settings, UserCredentials credentials)
        {
            return _connection.UpdatePersistentSubscriptionAsync(stream, groupName, settings, credentials);
        }

        public Task CreatePersistentSubscriptionAsync(string stream, string groupName, PersistentSubscriptionSettings settings, UserCredentials credentials)
        {
            return _connection.CreatePersistentSubscriptionAsync(stream, groupName, settings, credentials);
        }

        public Task DeletePersistentSubscriptionAsync(string stream, string groupName, UserCredentials userCredentials = null)
        {
            return _connection.DeletePersistentSubscriptionAsync(stream, groupName, userCredentials);
        }

        public Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, StreamMetadata metadata, UserCredentials userCredentials = null)
        {
            return _connection.SetStreamMetadataAsync(stream, expectedMetastreamVersion, metadata, userCredentials);
        }

        public Task<WriteResult> SetStreamMetadataAsync(string stream, int expectedMetastreamVersion, byte[] metadata, UserCredentials userCredentials = null)
        {
            return _connection.SetStreamMetadataAsync(stream, expectedMetastreamVersion, metadata, userCredentials);
        }

        public Task<StreamMetadataResult> GetStreamMetadataAsync(string stream, UserCredentials userCredentials = null)
        {
            return _connection.GetStreamMetadataAsync(stream, userCredentials);
        }

        public Task<RawStreamMetadataResult> GetStreamMetadataAsRawBytesAsync(string stream, UserCredentials userCredentials = null)
        {
            return _connection.GetStreamMetadataAsRawBytesAsync(stream, userCredentials);
        }

        public Task SetSystemSettingsAsync(SystemSettings settings, UserCredentials userCredentials = null)
        {
            return _connection.SetSystemSettingsAsync(settings, userCredentials);
        }

        public event EventHandler<ClientConnectionEventArgs> Connected
        {
            add { _connection.Connected += value; }
            remove { _connection.Connected -= value; }
        }

        public event EventHandler<ClientConnectionEventArgs> Disconnected
        {
            add { _connection.Disconnected += value; }
            remove { _connection.Disconnected -= value; }
        }

        public event EventHandler<ClientReconnectingEventArgs> Reconnecting
        {
            add { _connection.Reconnecting += value; }
            remove { _connection.Reconnecting -= value; }
        }

        public event EventHandler<ClientClosedEventArgs> Closed
        {
            add { _connection.Closed += value; }
            remove { _connection.Closed -= value; }
        }

        public event EventHandler<ClientErrorEventArgs> ErrorOccurred
        {
            add { _connection.ErrorOccurred += value; }
            remove { _connection.ErrorOccurred -= value; }
        }

        public event EventHandler<ClientAuthenticationFailedEventArgs> AuthenticationFailed
        {
            add { _connection.AuthenticationFailed += value; }
            remove { _connection.AuthenticationFailed -= value; }
        }

        public void Dispose()
        {
            _monitor.Dispose();
            _connection.Dispose();
        }
    }
}
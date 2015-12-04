using System;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Common.Logging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore.Connection
{
    public interface IConnectionStatusMonitor : IDisposable
    {
        IObservable<ConnectionInfo> ConnectionInfoChanged { get; }
        ConnectionInfo ConnectionInfo { get; }
    }

    public class ConnectionStatusMonitor : IConnectionStatusMonitor
    {
        private readonly IDisposable _subscription;
        private readonly BehaviorSubject<ConnectionInfo> _connectionInfoSubject = new BehaviorSubject<ConnectionInfo>(ConnectionInfo.Initial);
        protected static readonly ILog Log = LogManager.GetLogger<ConnectionStatusMonitor>();

        public ConnectionStatusMonitor(IEventStoreConnection connection)
        {
            var connectedChanged = Observable.FromEventPattern<ClientConnectionEventArgs>(h => connection.Connected += h,
                                                                                          h => connection.Connected -= h)
                                             .Select(_ => ConnectionStatus.Connected);

            var disconnectedChanged = Observable.FromEventPattern<ClientConnectionEventArgs>(h => connection.Disconnected += h,
                                                                                             h => connection.Disconnected -= h)
                                                .Select(_ => ConnectionStatus.Disconnected);

            var reconnectingChanged = Observable.FromEventPattern<ClientReconnectingEventArgs>(h => connection.Reconnecting += h,
                                                                                               h => connection.Reconnecting -= h)
                                                .Select(_ => ConnectionStatus.Connecting);

            _subscription = Observable.Merge(connectedChanged, disconnectedChanged, reconnectingChanged)
                                        .Scan(ConnectionInfo.Initial, UpdateConnectionInfo)
                                        .Subscribe(_connectionInfoSubject);
        }

        public IObservable<ConnectionInfo> ConnectionInfoChanged => _connectionInfoSubject.AsObservable();
        public ConnectionInfo ConnectionInfo => _connectionInfoSubject.Value;

        private static ConnectionInfo UpdateConnectionInfo(ConnectionInfo previousConnectionInfo, ConnectionStatus connectionStatus)
        {
            ConnectionInfo newConnectionInfo;

            if ((previousConnectionInfo.Status == ConnectionStatus.Disconnected ||
                 previousConnectionInfo.Status == ConnectionStatus.Connecting) &&
                connectionStatus == ConnectionStatus.Connected)
            {
                newConnectionInfo = new ConnectionInfo(connectionStatus, previousConnectionInfo.ConnectCount + 1);
            }
            else
            {
                newConnectionInfo = new ConnectionInfo(connectionStatus, previousConnectionInfo.ConnectCount);
            }

            if (Log.IsInfoEnabled)
            {
                Log.Info(newConnectionInfo);
            }

            return newConnectionInfo;
        }

        public void Dispose()
        {
            _subscription.Dispose();
            _connectionInfoSubject.Dispose();
        }
    }
}

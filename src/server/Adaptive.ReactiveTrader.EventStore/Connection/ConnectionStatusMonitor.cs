using System;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore.Connection
{
    public interface IConnectionStatusMonitor : IDisposable
    {
        IObservable<ConnectionInfo> ConnectionStatusChanged { get; }
    }

    public class ConnectionStatusMonitor : IConnectionStatusMonitor
    {
        private readonly IDisposable _connection;
        private readonly IConnectableObservable<ConnectionInfo> _connectionInfo;

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

            _connectionInfo = Observable.Merge(connectedChanged, disconnectedChanged, reconnectingChanged)
                                        .Scan(ConnectionInfo.Initial, UpdateConnectionInfo)
                                        .Replay();

            _connection = _connectionInfo.Connect();
        }

        public IObservable<ConnectionInfo> ConnectionStatusChanged => _connectionInfo;

        private static ConnectionInfo UpdateConnectionInfo(ConnectionInfo previousConnectionInfo, ConnectionStatus connectionStatus)
        {
            if ((previousConnectionInfo.Status == ConnectionStatus.Disconnected || 
                previousConnectionInfo.Status == ConnectionStatus.Connecting) && 
                connectionStatus == ConnectionStatus.Connected)
            {
                return new ConnectionInfo(connectionStatus, previousConnectionInfo.ConnectCount + 1);
            }

            return new ConnectionInfo(connectionStatus, previousConnectionInfo.ConnectCount);
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}
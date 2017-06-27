using System;
using System.Reactive;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using Adaptive.ReactiveTrader.Shared;
using Adaptive.ReactiveTrader.Shared.Extensions;
using Adaptive.ReactiveTrader.Shared.Logging;
using Microsoft.AspNet.SignalR.Client;
using Microsoft.AspNet.SignalR.Client.Http;
using System.Net.Http;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport
{
    /// <summary>
    /// This represents a single SignalR connection.
    /// The <see cref="ConnectionProvider"/> creates connections and is responsible for creating new one when a connection is closed.
    /// </summary>
    internal class Connection : IConnection
    {
        private readonly ISubject<ConnectionInfo> _statusStream;
        private readonly HubConnection _hubConnection;

        private bool _initialized;
        private readonly ILog _log;

        public Connection(string address, string username, ILoggerFactory loggerFactory)
        {
            _log = loggerFactory.Create(typeof (Connection));
            _statusStream = new BehaviorSubject<ConnectionInfo>(new ConnectionInfo(ConnectionStatus.Uninitialized, address, TransportName));
            Address = address;
            _hubConnection = new HubConnection(address);
            _hubConnection.Headers.Add(ServiceConstants.Server.UsernameHeader, username);
            CreateStatus().Subscribe(
                s => _statusStream.OnNext(new ConnectionInfo(s, address, TransportName)),
                _statusStream.OnError,
                _statusStream.OnCompleted);
            _hubConnection.Error += exception => _log.Error("There was a connection error with " + address, exception);

            BlotterHubProxy = _hubConnection.CreateHubProxy(ServiceConstants.Server.BlotterHub);
            ExecutionHubProxy = _hubConnection.CreateHubProxy(ServiceConstants.Server.ExecutionHub);
            PricingHubProxy = _hubConnection.CreateHubProxy(ServiceConstants.Server.PricingHub);
            ReferenceDataHubProxy = _hubConnection.CreateHubProxy(ServiceConstants.Server.ReferenceDataHub);
            ControlHubProxy = _hubConnection.CreateHubProxy(ServiceConstants.Server.ControlHub);
        }

        // TODO: Use modernhttpclient again when .netstandard is supported
        class ModernHttpClientSignalR : DefaultHttpClient
        {
        }

        public IObservable<Unit> Initialize()
        {
            if (_initialized)
            {
                throw new InvalidOperationException("Connection has already been initialized");
            }
            _initialized = true;

            return Observable.Create<Unit>(async observer =>
            {
                _statusStream.OnNext(new ConnectionInfo(ConnectionStatus.Connecting, Address, TransportName)); 

                try
                {
                    _log.InfoFormat("Connecting to {0} via {1}", Address, TransportName);
                    await _hubConnection.Start(new ModernHttpClientSignalR());
                    _statusStream.OnNext(new ConnectionInfo(ConnectionStatus.Connected, Address, TransportName));
                    observer.OnNext(Unit.Default);
                }
                catch (Exception e)
                {
                    _log.Error("An error occurred when starting SignalR connection", e);
                    observer.OnError(e);
                }

                return Disposable.Create(() =>
                {
                    try
                    {
                        _log.Info("Stoping connection...");
                        _hubConnection.Stop();
                        _log.Info("Connection stopped");
                    }
                    catch (Exception e)
                    {
                        // we must never throw in a disposable
                        _log.Error("An error occurred while stoping connection", e);
                    }
                });
            })
            .Publish()
            .RefCount();
        } 

        private IObservable<ConnectionStatus> CreateStatus()
        {
            // TODO
            //var closed = Observable.FromEvent(h => _hubConnection.Closed += h, h => _hubConnection.Closed -= h).Select(_ => ConnectionStatus.Closed);
            //var connectionSlow = Observable.FromEvent(h => _hubConnection.ConnectionSlow += h, h => _hubConnection.ConnectionSlow -= h).Select(_ => ConnectionStatus.ConnectionSlow);
            //var reconnected = Observable.FromEvent(h => _hubConnection.Reconnected += h, h => _hubConnection.Reconnected -= h).Select(_ => ConnectionStatus.Reconnected);
            //var reconnecting = Observable.FromEvent(h => _hubConnection.Reconnecting += h, h => _hubConnection.Reconnecting -= h).Select(_ => ConnectionStatus.Reconnecting);
            //return Observable.Merge(closed, connectionSlow, reconnected, reconnecting)
            //    .TakeUntilInclusive(status => status == ConnectionStatus.Closed); // complete when the connection is closed (it's terminal, SignalR will not attempt to reconnect anymore)
            return null;
        }

        public IObservable<ConnectionInfo> StatusStream => _statusStream;

        public string Address { get; }

        public string TransportName => _hubConnection?.Transport == null ? "none" : _hubConnection.Transport.Name;

        public IHubProxy ReferenceDataHubProxy { get; }
        public IHubProxy PricingHubProxy { get; }
        public IHubProxy ExecutionHubProxy { get; }
        public IHubProxy BlotterHubProxy { get; }
        public IHubProxy ControlHubProxy { get; }

        public void SetAuthToken(string authToken)
        {
            _hubConnection.Headers[AuthTokenProvider.AuthTokenKey] = authToken;
        }

        public override string ToString()
        {
            return string.Format("Address: {0}", Address);
        }
    }
}
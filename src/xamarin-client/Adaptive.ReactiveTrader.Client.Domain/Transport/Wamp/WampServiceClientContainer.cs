using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Client.Domain.Concurrency;
using Adaptive.ReactiveTrader.Shared.Logging;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    internal class WampServiceClientContainer : IDisposable
    {
        private readonly IWampConnection _connection;
        private readonly string _server;
        private readonly IConcurrencyService _concurrencyService;
        private readonly ILoggerFactory _loggerFactory;
        private readonly ISubject<ConnectionInfo> _statusStream;
        private const string TransportName = "WebSockets";
        private const int ExpectedServiceCount = 4;

        public WampServiceClientContainer(string server, string userName, IConcurrencyService concurrencyService, ILoggerFactory loggerFactory)
        {
            _statusStream = new BehaviorSubject<ConnectionInfo>(new ConnectionInfo(ConnectionStatus.Uninitialized, server, TransportName));
            _connection = new WampConnection(server, userName, loggerFactory);
            _server = server;
            _concurrencyService = concurrencyService;
            _loggerFactory = loggerFactory;
        }

        public async Task ConnectAsync()
        {
            _statusStream.OnNext(new ConnectionInfo(ConnectionStatus.Connecting, _server, TransportName));
            InitializeServiceClients();

            GetStatusStream().Subscribe(s => _statusStream.OnNext(new ConnectionInfo(s, _server, TransportName)),
                                        _statusStream.OnError,
                                        _statusStream.OnCompleted);

            await _connection.ConnectAsync();
        }

        public WampServiceClient Reference { get; private set; }
        public WampServiceClient Blotter { get; private set; }
        public WampServiceClient Execution { get; private set; }
        public WampServiceClient Pricing { get; private set; }

        public IObservable<ConnectionInfo> ConnectionStatusStream => _statusStream.AsObservable();

        private void InitializeServiceClients()
        {
            Reference = CreateServiceClient("reference");
            Blotter = CreateServiceClient("blotter");
            Execution = CreateServiceClient("execution");
            Pricing = CreateServiceClient("pricing");
        }

        private WampServiceClient CreateServiceClient(string serviceType)
        {
            var serviceClient = new WampServiceClient(_connection,
                                                      serviceType,
                                                      _concurrencyService.TaskPool,
                                                      _loggerFactory);
            serviceClient.Connect();
            return serviceClient;
        }

        private IObservable<ConnectionStatus> GetStatusStream()
        {
            // ReSharper disable once InvokeAsExtensionMethod
            return Observable.CombineLatest(Reference.ServiceStatusStream,
                                            Blotter.ServiceStatusStream,
                                            Execution.ServiceStatusStream,
                                            Pricing.ServiceStatusStream,
                                            (a, b, c, d) => (a.IsConnected ? 1 : 0) +
                                                            (b.IsConnected ? 1 : 0) +
                                                            (c.IsConnected ? 1 : 0) +
                                                            (d.IsConnected ? 1 : 0))
                             .Select(serviceCount =>
                             {
                                 if (serviceCount == 0)
                                 {
                                     return ConnectionStatus.Closed;
                                 }

                                 return serviceCount < ExpectedServiceCount
                                     ? ConnectionStatus.PartiallyConnected
                                     : ConnectionStatus.Connected;
                             });
        }

        public void Dispose()
        {
            Reference.Dispose();
            Blotter.Dispose();
            Execution.Dispose();
            Pricing.Dispose();
        }
    }
}
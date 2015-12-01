using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Common.Logging;
using WampSharp.V2;
using WampSharp.V2.Client;
using WampSharp.V2.Fluent;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class BrokerConnection : IBrokerConnection
    {
        class FactoryItem
        {
            public IServiceHostFactory Factory { get; set; }
            public CompositeDisposable CleanupDisposable { get; set; }
        }

        protected static readonly ILog Log = LogManager.GetLogger<BrokerConnection>();

        private readonly IWampChannel _channel;

        private readonly Dictionary<string, FactoryItem> _serviceHostFactories =
            new Dictionary<string, FactoryItem>();

        private readonly WampChannelReconnector _reconnector;
        private readonly SerialDisposable _sessionDispose = new SerialDisposable();

        private Broker _broker;
        private CompositeDisposable _compositeDisposable;

        public BrokerConnection(string uri, string realm)
        {
            _channel = new WampChannelFactory()
                .ConnectToRealm(realm)
                .WebSocketTransport(uri)
                .JsonSerialization()
                .Build();

            Func<Task> connect = async () =>
            {
                Log.InfoFormat("Trying to connect to broker {0}", uri);

                try
                {
                    await _channel.Open();

                    Log.Info("Connected");

                    _broker = new Broker(_channel);
                    _compositeDisposable = new CompositeDisposable {_broker};
                    _sessionDispose.Disposable = _compositeDisposable;

                    Log.Info("Creating Service Hosts..");
                    foreach (var s in _serviceHostFactories)
                    {
                        var serviceHost = await s.Value.Factory.Create(_broker);
                        await serviceHost.Start();

                        var disposable = Disposable.Create(() => { serviceHost.Dispose(); });
                        _compositeDisposable.Add(disposable);
                        s.Value.CleanupDisposable.Add(disposable);
                    }

                    Log.Info("Created Service Hosts.");
                }
                catch (Exception)
                {
                    _broker = null;
                    throw;
                }
            };

            _reconnector = new WampChannelReconnector(_channel, connect);
        }

        public Task<IDisposable> Register(IServiceHostFactory serviceHostFactory)
        {
            return Register(serviceHostFactory.GetType().Name, serviceHostFactory);
        }

        public async Task<IDisposable> Register(string key, IServiceHostFactory serviceHostFactory)
        {
            _serviceHostFactories.Add(key,
                new FactoryItem
                {
                    Factory = serviceHostFactory,
                    CleanupDisposable =
                        new CompositeDisposable {Disposable.Create(() => _serviceHostFactories.Remove(key))}
                });

            if (_broker != null)
            {
                var serviceHost = await serviceHostFactory.Create(_broker);
                await serviceHost.Start();

                var disposable = Disposable.Create(() =>
                {
                    serviceHost.Dispose();
                });
                _compositeDisposable.Add(disposable);
                _serviceHostFactories[key].CleanupDisposable.Add(disposable);
            }

            return _serviceHostFactories[key].CleanupDisposable;
        }

        public void Start()
        {
            _reconnector.Start();
        }

        public void Dispose()
        {
            _sessionDispose.Dispose();
            _reconnector.Dispose();
        }
    }
}
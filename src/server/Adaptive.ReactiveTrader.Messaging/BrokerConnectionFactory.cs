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
    public interface IBrokerConnection : IDisposable
    {
        IDisposable Register(IServiceHostFactory serviceHostFactory);
        void Start();
    }

    public interface IServiceHostFactory
    {
        Task<ServiceHostBase> Create(IBroker broker);
    }

    public class BrokerConnection : IBrokerConnection
    {
        protected static readonly ILog Log = LogManager.GetLogger<BrokerConnection>();

        private readonly IWampChannel _channel;

        private readonly Dictionary<IServiceHostFactory, CompositeDisposable> _serviceHostFactories =
            new Dictionary<IServiceHostFactory, CompositeDisposable>();

        private readonly WampChannelReconnector _reconnector;
        private readonly SerialDisposable _sessionDispose = new SerialDisposable();
        
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

                await _channel.Open();

                Log.Info("Connected");

                var broker = new Broker(_channel);
                var comp = new CompositeDisposable {broker};
                _sessionDispose.Disposable = comp;

                Log.Info("Creating Service Hosts..");
                foreach (var s in _serviceHostFactories)
                {
                    var serviceHost = await s.Key.Create(broker);
                    await serviceHost.Start();
                    
                    var disposable = Disposable.Create(() => { serviceHost.Dispose(); });
                    comp.Add(disposable);
                    s.Value.Add(disposable);
                }

                Log.Info("Created Service Hosts.");
            };

            _reconnector = new WampChannelReconnector(_channel, connect);
        }

        public IDisposable Register(IServiceHostFactory serviceHostFactory)
        {
            _serviceHostFactories.Add(serviceHostFactory,
                new CompositeDisposable {Disposable.Create(() => _serviceHostFactories.Remove(serviceHostFactory))});
            return _serviceHostFactories[serviceHostFactory];
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

    public static class BrokerConnectionFactory
    {
        public static IBrokerConnection Create(string uri, string realm)
        {
            return new BrokerConnection(uri, realm);
        }
    }
}
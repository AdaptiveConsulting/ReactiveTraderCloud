using System;
using System.Reactive.Disposables;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Serilog;
using WampSharp.V2;
using WampSharp.V2.Client;
using WampSharp.V2.Fluent;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class BrokerConnection : IDisposable
    {
        protected static readonly ILogger Log = Log.ForContext<BrokerConnection>();

        private readonly IWampChannel _channel;

        private readonly WampChannelReconnector _reconnector;
        private readonly SerialDisposable _sessionDispose = new SerialDisposable();

        private readonly BehaviorSubject<IConnected<IBroker>> _subject =
            new BehaviorSubject<IConnected<IBroker>>(Connected.No<IBroker>());

        public BrokerConnection(string uri, string realm)
        {
            _channel = new WampChannelFactory()
                .ConnectToRealm(realm)
                .WebSocketTransport(uri)
                .JsonSerialization()
                .Build();

            Func<Task> connect = async () =>
            {
                Log.Information("Trying to connect to broker {brokerUri}", uri);

                try
                {
                    await _channel.Open();
                    Log.Debug("Connection Opened.");

                    _subject.OnNext(Connected.Yes(new Broker(_channel)));
                }
                catch (Exception)
                {
                    Log.Debug("Connection Failed.");

                    _subject.OnNext(Connected.No<IBroker>());
                    throw;
                }
            };

            _reconnector = new WampChannelReconnector(_channel, connect);
        }

        public void Dispose()
        {
            _sessionDispose.Dispose();
            _reconnector.Dispose();
        }

        public IObservable<IConnected<IBroker>> GetBrokerStream()
        {
            return _subject;
        }

        public void Start()
        {
            _reconnector.Start();
        }
    }
}
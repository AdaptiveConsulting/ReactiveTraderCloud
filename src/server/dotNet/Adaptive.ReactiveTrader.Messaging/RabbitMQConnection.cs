using System;
using System.Reactive.Disposables;
using System.Reactive.Subjects;
using System.Threading;
using Adaptive.ReactiveTrader.Common;
using RabbitMQ.Client;
using Serilog;

namespace Adaptive.ReactiveTrader.Messaging
{
    public class RabbitMQConnection : IDisposable
    {
        private readonly CompositeDisposable _sessionDispose = new CompositeDisposable();
        private readonly ConnectionFactory _connectionFactory;

        private readonly BehaviorSubject<IConnected<IBroker>> _subject =
            new BehaviorSubject<IConnected<IBroker>>(Connected.No<IBroker>());

        private IConnection _connection;
        private IModel _channel;

        public RabbitMQConnection(string hostName, int port)
        {
            _connectionFactory = new ConnectionFactory {HostName = hostName, Port = port, AutomaticRecoveryEnabled = true};
        }

        public void Start()
        {
            var brokerStartingTime = 4;
            while (brokerStartingTime-- > 0 && _connection == null)
            {
                try
                {
                    _connection = _connectionFactory.CreateConnection();
                }
                catch (RabbitMQ.Client.Exceptions.BrokerUnreachableException)
                {
                    Thread.Sleep(2000);
                }
            }

            if (_connection == null)
            {
                throw new RabbitMQ.Client.Exceptions.BrokerUnreachableException(null);
            }

            _channel = _connection.CreateModel();
            _sessionDispose.Add(_connection);
            _sessionDispose.Add(_channel);

            _subject.OnNext(Connected.Yes(new Broker(_channel)));

            _connection.RecoverySucceeded += (obj, evt) =>
            {
                Log.Debug("Connection recovered.");
                _subject.OnNext(Connected.Yes(new Broker(_channel)));
            };

            _connection.ConnectionRecoveryError += (obj, evt) =>
            {
                Log.Error(evt.Exception, "Connection Failed.");
                _subject.OnNext(Connected.No<IBroker>());
            };
        }

        public IObservable<IConnected<IBroker>> GetBrokerStream()
        {
            return _subject;
        }

        public void Dispose()
        {
            _sessionDispose.Dispose();
        }
    }
}

using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Shared.DTO;
using Adaptive.ReactiveTrader.Shared.Logging;
using WampSharp.Core.Listener;
using WampSharp.V2;
using WampSharp.V2.Client;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Fluent;
using WampSharp.V2.Realm;

namespace Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp
{
    public interface IWampConnection
    {
        IObservable<T> SubscribeToTopic<T>(string topic);
        IObservable<TResponse> RequestResponse<TRequest, TResponse>(string operationName, TRequest request, string responseTopic = null);
        IObservable<bool> ConnectionStatus { get; }
        Task ConnectAsync();
    }

    internal class WampConnection : IWampConnection
    {
        private const string WampRealm = "com.weareadaptive.reactivetrader";
        private readonly string _userName;
        private readonly ILoggerFactory _loggerFactory;
        private readonly IWampChannel _channel;
        private readonly ILog _log;
        private readonly BehaviorSubject<bool> _connectionStatusSubject = new BehaviorSubject<bool>(false);
        private bool _openCalled;
        private readonly CompositeDisposable _disposables = new CompositeDisposable();

        public WampConnection(string serverUri, string userName, ILoggerFactory loggerFactory)
        {
            _log = loggerFactory.Create(typeof(WampConnection));
            _userName = userName;
            _loggerFactory = loggerFactory;
            _channel = new WampChannelFactory().ConnectToRealm(WampRealm)
                .WebSocketTransport(new Uri(serverUri))
                .JsonSerialization()    
                .Build();
        }

        public IObservable<bool> ConnectionStatus => _connectionStatusSubject.AsObservable();

        public bool IsConnected => _connectionStatusSubject.Value;

        public Task ConnectAsync()
        {
            if (!_openCalled)
            {
                _openCalled = true;
                _log.Info("Opening Connection");

                _disposables.Add(SubscribeToConnectionStatus());
                return _channel.Open();
            }

            return Task.CompletedTask;
        }

        private IDisposable SubscribeToConnectionStatus()
        {
            var connectionMonitor = _channel.RealmProxy.Monitor;
            var connectionEstablished = Observable.FromEventPattern<WampSessionCreatedEventArgs>(h => connectionMonitor.ConnectionEstablished += h,
                h => connectionMonitor.ConnectionEstablished -= h);

            var connectionBroken = Observable.FromEventPattern<WampSessionCloseEventArgs>(h => connectionMonitor.ConnectionBroken += h,
                h => connectionMonitor.ConnectionBroken -= h);

            var connectionError = Observable.FromEventPattern<WampConnectionErrorEventArgs>(h => connectionMonitor.ConnectionError += h,
                h => connectionMonitor.ConnectionError -= h);

            return Observable.Merge(connectionEstablished.Select(_ => true),
                connectionBroken.Select(_ => false),
                connectionError.Select(_ => false))
                .StartWith(false)
                .DistinctUntilChanged()
                .Subscribe(_connectionStatusSubject);
        }

        public IObservable<T> SubscribeToTopic<T>(string topic)
        {
            return Observable.Create<T>(obs =>
            {
                if (IsConnected)
                {
                    _log.Info($"Subscribing to topic {topic}");

                    return _channel.RealmProxy.Services
                        .GetSubject<T>(topic)
                        .Subscribe(obs);
                }

                obs.OnError(new InvalidOperationException($"Session not connected, cannot subscribe to topic {topic}"));

                return Disposable.Empty;
            });
        }

        public IObservable<TResponse> RequestResponse<TRequest, TResponse>(string operationName, TRequest request, string responseTopic = null)
        {
            return Observable.Create<TResponse>(obs =>
            {
                var callBack = new ObservableCallback<TResponse>(operationName, obs, _loggerFactory);
                _channel.RealmProxy.RpcCatalog.Invoke(callBack, new CallOptions(), operationName, new object[] {WrapMessage(request, responseTopic)});

                return callBack;
            });
        }

        private MessageDto WrapMessage(object payload, string queueName)
        {
            return new MessageDto
            {
                Payload = payload ?? new NothingDto(),
                ReplyTo = queueName,
                Username = _userName
            };
        }
    }
}
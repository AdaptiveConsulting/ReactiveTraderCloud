using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Heartbeat : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<Heartbeat>();

        private readonly IBroker _broker;
        private readonly IObservable<long> _heartbeatStream;
        private readonly ServiceHostBase _host;
        private IDisposable _disp = Disposable.Empty;

        public Heartbeat(ServiceHostBase host, IBroker broker)
        {
            _broker = broker;
            _host = host;
            HeartbeatInterval = TimeSpan.FromSeconds(1);
            _heartbeatStream = Observable.Timer(TimeSpan.Zero, HeartbeatInterval);
        }

        public TimeSpan HeartbeatInterval { get; }

        public void Dispose()
        {
            _disp.Dispose();
            Log.InfoFormat("Stopped heartbeat for {0}", _host);
        }

        public async Task Start()
        {
            var endpoint = await _broker.GetPublicEndPoint<HeartbeatDto>("status");

            _disp = _heartbeatStream.Select(
                _ =>
                    new HeartbeatDto
                    {
                        Instance = _host.InstanceID,
                        Timestamp = DateTime.Now,
                        Type = _host.ServiceType,
                        Load = _host.GetLoad()
                    })
                                    .Subscribe(endpoint);

            Log.InfoFormat("Started heartbeat for {0}", _host);
        }
    }
}
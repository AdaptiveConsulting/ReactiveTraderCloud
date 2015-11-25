using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Heartbeat : IDisposable
    {
        
        private readonly IBroker _broker;
        private readonly ServiceHostBase _host;
        private readonly IObservable<long> _heartbeatStream;
        public TimeSpan HeartbeatInterval { get; }
        private IDisposable _disp = Disposable.Empty;

        public Heartbeat( ServiceHostBase host, IBroker broker)
        {
            _broker = broker;
            _host = host;
            HeartbeatInterval = TimeSpan.FromSeconds(1);
            _heartbeatStream = Observable.Timer(TimeSpan.Zero, HeartbeatInterval);
        }

        public void Dispose()
        {
            _disp.Dispose();
        }

        public async Task Start()
        {
            var endpoint = await _broker.GetPublicEndPoint<HeartbeatDto>("status");

            _disp = _heartbeatStream.Select(
                _ => new HeartbeatDto { Instance = _host.InstanceID, Timestamp = DateTime.Now, Type = _host.ServiceType, Load = _host.GetLoad() })
                .Subscribe(endpoint);
        }
    }
}
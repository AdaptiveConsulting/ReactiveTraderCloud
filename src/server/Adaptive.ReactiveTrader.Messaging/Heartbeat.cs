using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Heartbeat : IDisposable
    {
        private readonly string _serviceType;
        private readonly string _serviceInstance;
        private readonly IBroker _broker;
        private readonly IObservable<long> _heartbeatStream;
        public TimeSpan HeartbeatInterval { get; }
        private IDisposable _disp = Disposable.Empty;

        public Heartbeat(string serviceType, string serviceInstance, IBroker broker)
        {
            _serviceType = serviceType;
            _serviceInstance = serviceInstance;
            _broker = broker;
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
                _ => new HeartbeatDto { Instance = _serviceInstance, Timestamp = DateTime.Now, Type = _serviceType })
                .Subscribe(endpoint);
        }
    }
}
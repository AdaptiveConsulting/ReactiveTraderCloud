using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        protected Guid Instance;
        private readonly Heartbeat _heartbreat;

        protected ServiceHostBase(IBroker b, string type )
        {
            Instance = Guid.NewGuid();
            _heartbreat = new Heartbeat(type, Instance, b);
        }

        public virtual async Task Start()
        {
            await _heartbreat.Start();
        }

        public virtual void Dispose()
        {
            _heartbreat.Dispose();
        }
    }
}
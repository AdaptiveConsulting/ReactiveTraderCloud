using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        protected readonly string InstanceID;
        private readonly Heartbeat _heartbreat;

        protected ServiceHostBase(IBroker b, string type, string instanceID )
        {
            InstanceID = instanceID;
            _heartbreat = new Heartbeat(type, InstanceID, b);
        }

        protected ServiceHostBase(IBroker b, string type)
        {
            InstanceID = type + "_" + Guid.NewGuid().ToString().Substring(0, 4);
            _heartbreat = new Heartbeat(type, InstanceID, b);
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
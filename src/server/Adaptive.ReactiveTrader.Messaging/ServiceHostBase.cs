using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        private readonly IBroker _broker;
        public readonly string InstanceID;
        private readonly Heartbeat _heartbreat;
        
        protected ServiceHostBase(IBroker broker, string type)
        {
            ServiceType = type;
            _broker = broker;
            InstanceID = type + "." + Guid.NewGuid().ToString().Substring(0, 4);
            _heartbreat = new Heartbeat(this, broker);
        }

        public readonly string ServiceType;

        protected void RegisterCall(string procName, Func<IRequestContext, IMessage, Task> procedure)
        {
            _broker.RegisterCall($"{InstanceID}.{procName}", procedure);
        }

        public virtual async Task Start()
        {
            await _heartbreat.Start();
        }

        public virtual double GetLoad()
        {
            return 0;
        }

        public virtual void Dispose()
        {
            _heartbreat.Dispose();
        }
    }
}
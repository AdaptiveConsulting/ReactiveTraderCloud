using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        private readonly IBroker _broker;
        public readonly string InstanceID;
        private readonly Heartbeat _heartbeat;
        private readonly CompositeDisposable _registedCalls = new CompositeDisposable();
        private bool _started;

        protected ServiceHostBase(IBroker broker, string type)
        {
            ServiceType = type;
            _broker = broker;
            InstanceID = type + "." + Guid.NewGuid().ToString().Substring(0, 4);
            _heartbeat = new Heartbeat(this, broker);
        }

        public readonly string ServiceType;

        protected void RegisterCall(string procName, Func<IRequestContext, IMessage, Task> procedure)
        {
            var instanceProcedureName = $"{InstanceID}.{procName}";
            _registedCalls.Add(_broker.RegisterCall(instanceProcedureName, procedure));
        }

        protected void RegisterCallResponse<T>(string procName, Func<IRequestContext, IMessage, Task<T>> procedure)
        {
            var instanceProcedureName = $"{InstanceID}.{procName}";
            _registedCalls.Add(_broker.RegisterCallResponse(instanceProcedureName, procedure));
        }

        public virtual async Task Start()
        {
            if (_started) throw new MethodAccessException(this + " has already been started.");
            _started = true;
            await _heartbeat.Start();
        }

        public virtual double GetLoad()
        {
            return 0;
        }

        public virtual void Dispose()
        {
            _registedCalls.Dispose();
            _heartbeat.Dispose();
        }

        public override string ToString()
        {
            return $"{InstanceID}";
        }
    }
}
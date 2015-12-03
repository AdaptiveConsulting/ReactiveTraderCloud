using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ServiceHostBase>();

        private readonly IBroker _broker;
        public readonly string InstanceID;
        private readonly Heartbeat _heartbeat;
        private readonly CompositeDisposable _registedCalls = new CompositeDisposable();

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
            Log.Info($"procedure {procName}() registered");
        }

        protected void RegisterCallResponse<T>(string procName, Func<IRequestContext, IMessage, Task<T>> procedure)
        {
            var instanceProcedureName = $"{InstanceID}.{procName}";
            _registedCalls.Add(_broker.RegisterCallResponse(instanceProcedureName, procedure));
            Log.Info($"procedure {procName}() registered");
        }

        protected void StartHeartBeat()
        {
            _heartbeat.Start().Wait();
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
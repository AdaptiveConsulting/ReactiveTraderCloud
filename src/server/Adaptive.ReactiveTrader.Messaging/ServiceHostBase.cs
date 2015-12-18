using System;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Common.Logging;

namespace Adaptive.ReactiveTrader.Messaging
{
    public abstract class ServiceHostBase : IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<ServiceHostBase>();

        private readonly IBroker _broker;
        private readonly Heartbeat _heartbeat;
        private readonly CompositeDisposable _registedCalls = new CompositeDisposable();
        public readonly string InstanceID;

        public readonly string ServiceType;

        protected ServiceHostBase(IBroker broker, string type)
        {
            ServiceType = type;
            _broker = broker;
            InstanceID = type + "." + Guid.NewGuid().ToString().Substring(0, 4);
            _heartbeat = new Heartbeat(this, broker);
        }

        public virtual void Dispose()
        {
            _registedCalls.Dispose();
            _heartbeat.Dispose();
        }

        protected void RegisterCall(string procName, Func<IRequestContext, IMessage, Task> procedure)
        {
            var instanceProcedureName = $"{InstanceID}.{procName}";
            var call = _broker.RegisterCall(instanceProcedureName, procedure);
            _registedCalls.Add(Disposable.Create(() =>
            {
                Log.Info($"unregistering from {procName}");
                call.Result.DisposeAsync().Wait(TimeSpan.FromSeconds(5));
                Log.Info($"unregistered from {procName}");
            }));
            Log.Info($"procedure {procName}() registered");
        }

        protected void RegisterCallResponse<T>(string procName, Func<IRequestContext, IMessage, Task<T>> procedure)
        {
            var instanceProcedureName = $"{InstanceID}.{procName}";
            var call = _broker.RegisterCallResponse(instanceProcedureName, procedure);
            _registedCalls.Add(Disposable.Create(() =>
            {
                Log.Info($"unregistering from {procName}");
                call.Result.DisposeAsync().Wait(TimeSpan.FromSeconds(5));
                Log.Info($"unregistered from {procName}");
            }));
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

        public override string ToString()
        {
            return $"{InstanceID}";
        }
    }
}
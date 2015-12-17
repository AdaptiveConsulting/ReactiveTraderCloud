using System.Collections.Generic;
using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public interface IServiceLauncher
    {
        string StartService(ServiceType serviceType);
        bool KillService(string serviceName);
        IEnumerable<string> GetRunningServices();
        void InitializeEventStore(IEventStoreConfiguration config, bool runEmbeddedEventStore);
    }
}
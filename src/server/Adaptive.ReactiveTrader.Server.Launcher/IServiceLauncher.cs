using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public interface IServiceLauncher
    {
        string StartService(ServiceType serviceType);
        bool KillService(string serviceName);
        IEnumerable<string> GetRunningServers();
    }
}
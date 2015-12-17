using System.Collections.Generic;
using Adaptive.ReactiveTrader.Common.Config;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class LauncherConfig
    {
        public LauncherConfig()
        {
            InvalidArguments = new List<string>();
            ServicesToStart = new List<ServiceType>();
        }

        public bool RunEmbeddedEventStore { get; set; }
        public bool PopulateEventStore { get; set; }
        public bool IsInteractive { get; set; }
        public bool Help { get; set; }
        public IEventStoreConfiguration EventStoreParameters { get; set; }
        public bool RunMessageBroker { get; set; }
        public IEnumerable<ServiceType> ServicesToStart { get; set; }
        public IEnumerable<string> InvalidArguments { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Server.Analytics;
using Adaptive.ReactiveTrader.Server.Blotter;
using Adaptive.ReactiveTrader.Server.Core;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.TradeExecution;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class ServiceLauncher : IServiceLauncher
    {
        private readonly Dictionary<string, IDisposable> _servers = new Dictionary<string, IDisposable>();

        private readonly Dictionary<ServiceType, Lazy<IServiceHostFactory>> _factories =
            new Dictionary<ServiceType, Lazy<IServiceHostFactory>>();

        public ServiceLauncher()
        {
            InitializeFactories();
        }

        private void InitializeFactories()
        {
            _factories.Add(ServiceType.Reference, new Lazy<IServiceHostFactory>(() => new ReferenceDataReadServiceHostFactory()));
            _factories.Add(ServiceType.Pricing, new Lazy<IServiceHostFactory>(() => new PriceServiceHostFactory()));
            _factories.Add(ServiceType.Blotter, new Lazy<IServiceHostFactory>(() => new BlotterServiceHostFactory()));
            _factories.Add(ServiceType.Execution, new Lazy<IServiceHostFactory>(() => new TradeExecutionServiceHostFactory()));
            _factories.Add(ServiceType.Analytics, new Lazy<IServiceHostFactory>(() => new AnalyticsServiceHostFactory()));
        }


        public void StartService(string name, ServiceType type)
        {
            var factory = _factories[type].Value;

            var a = new App(new string[] {}, factory);
            Task.Run(() => a.Start());
            _servers.Add(name, Disposable.Create(() => a.Kill()));
        }

        public string StartService(ServiceType type)
        {
            var name = GenerateName(type);

            StartService(name, type);

            return name;
        }

        private string GenerateName(ServiceType type)
        {
            var counter = 0;
            string proposedName;

            do
            {
                counter++;
                proposedName = type.ToString().Substring(0,1).ToLower() + counter;
            } while (_servers.ContainsKey(proposedName));

            return proposedName;
        }
        
        public bool KillService(string serviceName)
        {
            if (!_servers.ContainsKey(serviceName)) return false;

            var server = _servers[serviceName];
            _servers.Remove(serviceName);
            server.Dispose();
            return true;
        }

        public IEnumerable<string> GetRunningServers()
        {
            return _servers.Keys;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Reactive.Disposables;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.Server.Analytics;
using Adaptive.ReactiveTrader.Server.Blotter;
using Adaptive.ReactiveTrader.Server.Host;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Adaptive.ReactiveTrader.Server.TradeExecution;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class ServiceLauncher : IServiceLauncher
    {
        private readonly Dictionary<string, IDisposable> _services = new Dictionary<string, IDisposable>();

        private readonly Dictionary<ServiceType, Lazy<IServiceHostFactory>> _factories =
            new Dictionary<ServiceType, Lazy<IServiceHostFactory>>();

        public ServiceLauncher()
        {
            InitializeFactories();
        }

        private void InitializeFactories()
        {
            _factories.Add(ServiceType.Reference,
                new Lazy<IServiceHostFactory>(() => new ReferenceDataReadServiceHostFactory()));
            _factories.Add(ServiceType.Pricing, new Lazy<IServiceHostFactory>(() => new PriceServiceHostFactory()));
            _factories.Add(ServiceType.Blotter, new Lazy<IServiceHostFactory>(() => new BlotterServiceHostFactory()));
            _factories.Add(ServiceType.Execution,
                new Lazy<IServiceHostFactory>(() => new TradeExecutionServiceHostFactory()));
            _factories.Add(ServiceType.Analytics, new Lazy<IServiceHostFactory>(() => new AnalyticsServiceHostFactory()));
        }


        public string StartService(ServiceType type)
        {
            var name = GenerateName(type);
            
            var factory = _factories[type].Value;

            var a = new App(new string[] {}, factory);
            _services.Add(name, Disposable.Create(() => a.Kill()));
            Task.Run(() => a.Start());

            return name;
        }

        private string GenerateName(ServiceType type)
        {
            var counter = 0;
            string proposedName;

            do
            {
                counter++;
                proposedName = type.ToString().Substring(0, 1).ToLower() + counter;
            } while (_services.ContainsKey(proposedName));

            return proposedName;
        }

        public bool KillService(string serviceName)
        {
            if (!_services.ContainsKey(serviceName)) return false;

            var server = _services[serviceName];
            _services.Remove(serviceName);
            server.Dispose();
            return true;
        }

        public IEnumerable<string> GetRunningServices()
        {
            return _services.Keys;
        }

        public void InitializeEventStore(IEventStoreConfiguration configuration)
        {
            var eventStoreConnection = EventStoreConnectionFactory.Create(EventStoreLocation.External, configuration);

            eventStoreConnection.ConnectAsync().Wait();

            ReferenceDataHelper.PopulateRefData(eventStoreConnection).Wait();
        }
    }
}
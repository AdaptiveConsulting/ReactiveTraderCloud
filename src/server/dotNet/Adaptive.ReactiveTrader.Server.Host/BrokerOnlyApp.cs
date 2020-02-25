using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.Messaging;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public class BrokerOnlyApp : App<IServiceHostFactoryWithBroker>
    {
        public BrokerOnlyApp(IServiceConfiguration config, IServiceHostFactoryWithBroker factory) : base(config, factory)
        {
        }

        protected override IDisposable InitializeFactory(IObservable<IConnected<IBroker>> brokerStream)
        {
            return Factory.Initialize(brokerStream);
        }
    }
}
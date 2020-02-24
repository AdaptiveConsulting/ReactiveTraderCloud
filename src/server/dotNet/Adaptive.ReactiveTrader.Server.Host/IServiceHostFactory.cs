using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Host
{
    public interface IServiceHostFactory : IDisposable
    {
    }

    public interface IServiceHostFactoryWithBroker : IServiceHostFactory
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream);
    }

    public interface IServiceHostFactoryWithEventStore : IServiceHostFactory
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream,
                               IObservable<IConnected<IEventStoreConnection>> eventStoreStream);
    }
}

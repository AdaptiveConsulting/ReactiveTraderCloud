using System;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Messaging;
using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.Server.Core
{
    public interface IServiceHostFactory : IDisposable
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> broker);
    }

    public interface IServiceHostFactoryWithEventStore : IServiceHostFactory
    {
        IDisposable Initialize(IObservable<IConnected<IBroker>> broker,
                               IObservable<IConnected<IEventStoreConnection>> eventStore);
    }
}
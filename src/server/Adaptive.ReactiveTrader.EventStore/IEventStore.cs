using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public interface IEventStore
    {
        IEventStoreConnection Connection { get; }
    }

    public interface IEventStoreSubscription
    {
        void Stop();
    }

    public interface IEventStoreConsumer
    {
        void Initialize(IEventStoreConnection es);
    }
}
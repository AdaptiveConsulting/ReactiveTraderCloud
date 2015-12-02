using EventStore.ClientAPI;

namespace Adaptive.ReactiveTrader.EventStore
{
    public interface IEventStoreConsumer
    {
        void Initialize(IEventStoreConnection es);
    }
}
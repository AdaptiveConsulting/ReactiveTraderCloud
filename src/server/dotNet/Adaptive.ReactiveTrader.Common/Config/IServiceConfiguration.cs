namespace Adaptive.ReactiveTrader.Common.Config
{
    public interface IServiceConfiguration
    {
        IEventStoreConfiguration EventStore { get; }
        IBrokerConfiguration Broker { get; }
    }
}
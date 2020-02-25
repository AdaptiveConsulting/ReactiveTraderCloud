namespace Adaptive.ReactiveTrader.Common.Config
{
    public interface IEventStoreConfiguration
    {
        string Host { get; }
        int Port { get; }
    }
}
namespace Adaptive.ReactiveTrader.Common.Config
{
    public interface IBrokerConfiguration
    {
        string Host { get; }
        int Port { get; }
        string Realm { get; }
    }
}
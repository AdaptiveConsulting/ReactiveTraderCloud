namespace Adaptive.ReactiveTrader.Client.Domain.Transport
{
    public enum ConnectionStatus
    {
        Uninitialized,
        Connecting,
        Connected,
        PartiallyConnected,
        Closed
    }
}
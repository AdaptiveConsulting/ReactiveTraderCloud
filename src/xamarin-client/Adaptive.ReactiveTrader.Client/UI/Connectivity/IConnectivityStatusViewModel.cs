namespace Adaptive.ReactiveTrader.Client.UI.Connectivity
{
    public interface IConnectivityStatusViewModel
    {
        string Status { get; }
        string Server { get; }
        bool Disconnected { get; }
        long UiUpdates { get; }
        long TicksReceived { get; }
        string ServerClientLatency { get; }
        string TotalLatency { get; }
        long UiLatency { get; }
        string TransportName { get; }
        string Histogram { get; }
        string CpuTime { get; }
        string CpuPercent { get; }
    }
}
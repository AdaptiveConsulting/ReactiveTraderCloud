namespace Adaptive.ReactiveTrader.Common
{
    public interface IConnected<out T>
    {
        T Value { get; }
        bool IsConnected { get; }
    }
}
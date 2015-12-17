namespace Adaptive.ReactiveTrader.Messaging.Abstraction
{
    public interface ISerializer
    {
        byte[] Serialize<T>(T instance);
        T Deserialize<T>(byte[] payload);
    }
}
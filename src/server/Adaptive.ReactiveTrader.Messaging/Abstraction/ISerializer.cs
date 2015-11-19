namespace Adaptive.ReactiveTrader.Messaging
{
    public interface ISerializer
    {
        byte[] Serialize<T>(T instance);
        T Deserialize<T>(byte[] payload);
    }
}
namespace Adaptive.ReactiveTrader.Common
{
    public class Connected<T> : IConnected<T>
    {
        public T Value { get; }

        public Connected(T value)
        {
            Value = value;
            IsConnected = true;
        }

        public Connected()
        {
        }

        public bool IsConnected { get; }
    }

    public static class Connected
    {
        public static IConnected<T> Yes<T>(T value)
        {
            return new Connected<T>(value);
        }

        public static IConnected<T> No<T>()
        {
            return new Connected<T>();
        }
    }

}
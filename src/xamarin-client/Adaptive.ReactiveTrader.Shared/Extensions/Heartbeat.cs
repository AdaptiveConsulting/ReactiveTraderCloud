namespace Adaptive.ReactiveTrader.Shared.Extensions
{
    internal class Heartbeat<T> : IHeartbeat<T>
    {
        public bool IsHeartbeat { get; }
        public T Update { get; }

        public Heartbeat() : this(true, default(T))
        {
        }

        public Heartbeat(T update) : this(false, update)
        {
        }

        private Heartbeat(bool isHeartbeat, T update)
        {
            IsHeartbeat = isHeartbeat;
            Update = update;
        }
    }
}
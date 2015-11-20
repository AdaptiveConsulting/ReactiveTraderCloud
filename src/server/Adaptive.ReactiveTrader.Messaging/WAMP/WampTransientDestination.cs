namespace Adaptive.ReactiveTrader.Messaging
{
    internal class WampTransientDestination : ITransientDestination
    {
        public string Topic { get; }

        public WampTransientDestination(string topic)
        {
            Topic = topic;
        }

        public override string ToString()
        {
            return Topic;
        }
    }
}
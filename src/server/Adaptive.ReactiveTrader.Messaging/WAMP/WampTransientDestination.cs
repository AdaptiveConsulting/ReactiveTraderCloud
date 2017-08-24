using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class WampTransientDestination : ITransientDestination
    {
        public WampTransientDestination(string topic)
        {
            Topic = topic;
        }

        public string Topic { get; }

        public override string ToString()
        {
            return Topic;
        }
    }
}
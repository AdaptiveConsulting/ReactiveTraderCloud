using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class Message : IMessage
    {
        public IMessageProperties Properties { get; set; }
        public byte[] Payload { get; set; }
        public string SessionId { get; set; }
        public ITransientDestination ReplyTo { get; set; }
    }
}
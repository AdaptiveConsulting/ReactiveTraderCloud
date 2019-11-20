using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class Message : IMessage
    {
        public byte[] Payload { get; set; }
        public string SessionId { get; set; }
        public string ReplyTo { get; set; }
    }
}
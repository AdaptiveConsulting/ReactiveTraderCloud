namespace Adaptive.ReactiveTrader.Messaging
{
    internal class Message : IMessage
    {
        public byte[] Payload { get; set; }
        public string ReplyTo { get; set; }
    }
}

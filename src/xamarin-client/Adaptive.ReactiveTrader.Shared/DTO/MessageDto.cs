namespace Adaptive.ReactiveTrader.Shared.DTO
{
    public class MessageDto
    {
        public string Username { get; set; }
        public string ReplyTo { get; set; }
        public object Payload { get; set; }
    }
}
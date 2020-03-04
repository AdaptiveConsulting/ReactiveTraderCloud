namespace Adaptive.ReactiveTrader.Messaging
{
    public class RequestContext : IRequestContext
    {
        public RequestContext(IMessage requestMessage, string username, string replyTo, string correlationId)
        {
            RequestMessage = requestMessage;
            Username = username;
            ReplyTo = replyTo;
            CorrelationId = correlationId;
        }

        public string ReplyTo { get; }
        public string CorrelationId { get; }

        public IMessage RequestMessage { get; }
        public string Username { get; }
    }
}

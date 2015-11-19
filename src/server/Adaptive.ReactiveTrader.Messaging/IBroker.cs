using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task<IObserver<T>> CreateChannelAsync<T>(string topic);
        void RegisterCall(string v, Action<IRequestContext, IMessage> onMessage);
        Task<IObserver<T>> CreateChannelAsync<T>(ITransientDestination replyTo);
    }

    public class MessageDto
    {
        public string Username { get; set; }
        public string ReplyTo { get; set; }
        public object Payload { get; set; }
    }

    internal class Message : IMessage
    {
        public IMessageProperties Properties { get; set; }
        public byte[] Payload { get; set; }
        public string SessionId { get; set; }
        public ITransientDestination ReplyTo { get; set; }
    }
}
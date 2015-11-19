using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task<IObserver<T>> CreateChannelAsync<T>(string topic);
        void RegisterCall(string v, Action<Message> onMessage);
    }

    public class Message
    {
        public string ReplyTo { get; set; }
        public object Payload { get; set; }
    }

}
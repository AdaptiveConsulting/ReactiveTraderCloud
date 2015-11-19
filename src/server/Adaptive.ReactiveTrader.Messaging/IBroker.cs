using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        void RegisterCall(string v, Action<IRequestContext, IMessage> onMessage);
        Task<IObserver<T>> CreateChannelAsync<T>(ITransientDestination replyTo);
    }
}
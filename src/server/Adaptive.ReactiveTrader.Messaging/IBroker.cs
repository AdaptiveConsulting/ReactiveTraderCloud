using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task RegisterCall(string v, Action<IRequestContext, IMessage> onMessage);
        Task<IObserver<T>> CreateChannelAsync<T>(ITransientDestination replyTo);
        Task RegisterCallResponse<TResponse>(string v, Func<IRequestContext, IMessage, Task<TResponse>> onMessage);
    }
}
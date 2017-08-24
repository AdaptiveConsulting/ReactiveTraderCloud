using System;
using System.Threading.Tasks;
using SystemEx;
using Adaptive.ReactiveTrader.Messaging.Abstraction;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task<IAsyncDisposable> RegisterCall(string procName, Func<IRequestContext, IMessage, Task> onMessage);
        Task<IAsyncDisposable> RegisterCallResponse<TResponse>(string procName, Func<IRequestContext, IMessage, Task<TResponse>> onMessage);

        Task<IPrivateEndPoint<T>> GetPrivateEndPoint<T>(ITransientDestination replyTo);
        Task<IEndPoint<T>> GetPublicEndPoint<T>(string topic);

        IObservable<T> SubscribeToTopic<T>(string topic);
    }
}
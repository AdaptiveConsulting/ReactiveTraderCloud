using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task RegisterCall(string procName, string instanceID, Func<IRequestContext, IMessage, Task> onMessage);
        Task RegisterCallResponse<TResponse>(string procName, Func<IRequestContext, IMessage, Task<TResponse>> onMessage);

        Task<IPrivateEndPoint<T>> GetPrivateEndPoint<T>(ITransientDestination replyTo);
        Task<IEndPoint<T>> GetPublicEndPoint<T>(string topic);
    }
}
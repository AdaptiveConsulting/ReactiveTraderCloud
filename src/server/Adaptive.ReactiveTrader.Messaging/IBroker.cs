using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBroker
    {
        Task RegisterCall(string v, Func<IRequestContext, IMessage, Task> onMessage);
        Task<IPrivateEndPoint<T>> GetEndPoint<T>(ITransientDestination replyTo);
    }
}
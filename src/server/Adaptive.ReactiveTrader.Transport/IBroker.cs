using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Transport
{
    public interface IBroker
    {
        Task RegisterService(object service);
        Task<IObserver<T>> CreateChannelAsync<T>(string topic);
    }
}
using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IBrokerConnection : IDisposable
    {
        Task<IDisposable> Register(IServiceHostFactory serviceHostFactory);
        Task<IDisposable> Register(string name, IServiceHostFactory serviceHostFactory);
        void Start();
    }
}
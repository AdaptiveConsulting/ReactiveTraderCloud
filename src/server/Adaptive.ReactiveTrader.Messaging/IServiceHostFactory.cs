using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Messaging
{
    public interface IServiceHostFactory
    {
        Task<ServiceHostBase> Create(IBroker broker);
    }
}
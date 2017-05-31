using System;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcessRepository
    {
        Task<TProcess> GetByIdAsync<TProcess>(string id) where TProcess : class, IProcess;

        Task<int> SaveAsync(IProcess process, params Tuple<string, string>[] extraHeaders);
    }
}
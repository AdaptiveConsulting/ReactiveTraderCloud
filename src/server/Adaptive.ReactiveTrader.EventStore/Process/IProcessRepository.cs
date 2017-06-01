using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcessRepository
    {
        Task<TProcess> GetByIdAsync<TProcess>(string id) where TProcess : IProcess, new();
        Task<int> SaveAsync(IProcess process, params KeyValuePair<string, string>[] extraHeaders);
    }
}
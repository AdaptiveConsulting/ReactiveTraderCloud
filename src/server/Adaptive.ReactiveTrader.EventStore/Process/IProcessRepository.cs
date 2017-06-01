using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcessRepository
    {
        Task<TProcess> GetByIdAsync<TProcess>(object id) where TProcess : class, IProcess, new();
        Task<int> SaveAsync(IProcess process, params KeyValuePair<string, string>[] extraHeaders);
    }
}
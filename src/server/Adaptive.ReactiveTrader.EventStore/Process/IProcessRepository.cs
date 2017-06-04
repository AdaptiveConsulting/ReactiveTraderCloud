using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.EventStore.Process
{
    public interface IProcessRepository
    {
        Task<TProcess> GetByIdAsync<TProcess>(string id, Func<TProcess> factory) where TProcess : IProcess;
        Task<int> SaveAsync(IProcess process, params KeyValuePair<string, string>[] extraHeaders);
    }
}
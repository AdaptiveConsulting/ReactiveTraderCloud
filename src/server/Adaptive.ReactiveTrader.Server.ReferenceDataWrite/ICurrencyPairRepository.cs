using System.Threading.Tasks;

namespace Adaptive.ReactiveTrader.Server.ReferenceDataWrite
{
    public interface ICurrencyPairRepository
    {
        Task Create(string symbol, int pipsPosition, int ratePrecision, decimal sampleRate, string comment = null);
        Task Activate(string symbol);
        Task Deactivate(string symbol);
    }
}
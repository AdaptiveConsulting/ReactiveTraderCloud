using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface ICurrencyPairRepository
    {
        IEnumerable<CurrencyPairInfo> GetAllCurrencyPairs();
        CurrencyPairDto GetCurrencyPair(string symbol);
        bool Exists(string symbol);
        decimal GetSampleRate(string symbol);
        IEnumerable<CurrencyPairInfo> GetAllCurrencyPairInfos();
    }
}
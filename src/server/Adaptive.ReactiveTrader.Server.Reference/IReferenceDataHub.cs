using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IReferenceDataHub
    {
        [WampProcedure("reference.getCurrencyPairs")]
        IEnumerable<CurrencyPairUpdateDto> GetCurrencyPairs();
    }
}
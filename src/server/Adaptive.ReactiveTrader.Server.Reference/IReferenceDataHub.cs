using System.Collections.Generic;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Server.ReferenceData
{
    public interface IReferenceDataHub
    {
        [WampProcedure("reference.getCurrencyPairs")]
        IEnumerable<CurrencyPairUpdateDto> GetCurrencyPairs();
    }
}
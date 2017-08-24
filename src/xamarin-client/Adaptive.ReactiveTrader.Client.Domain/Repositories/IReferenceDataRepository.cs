using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain.Repositories
{
    public interface IReferenceDataRepository
    {
        IObservable<IEnumerable<ICurrencyPairUpdate>> GetCurrencyPairsStream();
    }
}

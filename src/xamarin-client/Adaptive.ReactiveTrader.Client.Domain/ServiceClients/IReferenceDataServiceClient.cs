using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Shared.DTO.ReferenceData;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal interface IReferenceDataServiceClient
    {
        IObservable<IEnumerable<CurrencyPairUpdateDto>> GetCurrencyPairUpdatesStream();
    }
}
using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Shared.DTO.Execution;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal interface IBlotterServiceClient
    {
        IObservable<IEnumerable<TradeDto>> GetTradesStream();
    }
}
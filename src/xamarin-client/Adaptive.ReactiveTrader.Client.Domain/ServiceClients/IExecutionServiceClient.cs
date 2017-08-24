using System;
using Adaptive.ReactiveTrader.Shared.DTO.Execution;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal interface IExecutionServiceClient
    {
        IObservable<TradeDto> ExecuteRequest(ExecuteTradeRequestDto tradeRequest);
    }
}
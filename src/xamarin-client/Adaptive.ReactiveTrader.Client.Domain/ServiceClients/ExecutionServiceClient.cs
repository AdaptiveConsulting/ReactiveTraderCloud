using Adaptive.ReactiveTrader.Client.Domain.Transport.Wamp;
using Adaptive.ReactiveTrader.Shared.DTO.Execution;
using System;
using System.Reactive.Linq;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal class ExecutionServiceClient : IExecutionServiceClient
    {
        private readonly WampServiceClient _serviceClient;

        public ExecutionServiceClient(WampServiceClient serviceClient)
        {
            _serviceClient = serviceClient;
        }

        public IObservable<TradeDto> ExecuteRequest(ExecuteTradeRequestDto executeTradeRequest)
        {
            return _serviceClient.CreateRequestResponseOperation<ExecuteTradeRequestDto, ExecuteTradeResponseDto>("executeTrade", executeTradeRequest)
                              .Select(x => x.Trade)
                              .Where(x => x.Status != TradeStatusDto.Pending);
        }
    }
}

using System;
using System.Collections.Generic;
using Adaptive.ReactiveTrader.Shared.DTO;
using Adaptive.ReactiveTrader.Shared.DTO.Control;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    public interface IControlServiceClient
    {
        IObservable<UnitDto> SetPriceFeedThroughput(FeedThroughputDto request);
        IObservable<IEnumerable<CurrencyPairStateDto>> GetCurrencyPairStates();
        IObservable<UnitDto> SetCurrencyPairState(CurrencyPairStateDto request);
        IObservable<FeedThroughputDto> GetPriceFeedThroughput();
    }
}
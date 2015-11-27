using System;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public interface IBlotterService
    {
        IObservable<TradesDto> GetTradesStream();
    }
}
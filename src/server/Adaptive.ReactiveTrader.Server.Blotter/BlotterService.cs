using System;

namespace Adaptive.ReactiveTrader.Server.Blotter
{
    public class BlotterService : IBlotterService
    {
        private readonly IObservable<TradesDto> _tradesRepository;

        public BlotterService(IObservable<TradesDto> tradesRepository)
        {
            _tradesRepository = tradesRepository;
        }
    }

    public interface IBlotterService
    {
    }
}

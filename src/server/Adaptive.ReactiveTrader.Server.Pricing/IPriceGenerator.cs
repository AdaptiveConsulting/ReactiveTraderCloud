using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPriceGenerator
    {
        string Symbol { get; }
        IEnumerable<SpotPriceDto> Sequence();
    }
}
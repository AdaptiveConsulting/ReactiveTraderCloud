using System.Collections.Generic;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.Pricing
{
    public interface IPriceGenerator
    {
        IEnumerable<SpotPriceDto> Sequence();
        string Symbol { get; }
    }
}
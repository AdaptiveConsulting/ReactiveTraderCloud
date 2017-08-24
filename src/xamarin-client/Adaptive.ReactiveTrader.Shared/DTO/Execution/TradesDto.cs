using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Shared.DTO.Execution
{
    public class TradesDto
    {
        public static readonly TradesDto Empty = new TradesDto(new TradeDto[0], false, false);

        public TradesDto(IList<TradeDto> trades, bool isStateOfTheWorld, bool isStale)
        {
            Trades = trades;
            IsStateOfTheWorld = isStateOfTheWorld;
            IsStale = isStale;
        }

        public IList<TradeDto> Trades { get; }
        public bool IsStateOfTheWorld { get; }
        public bool IsStale { get; }
    }
}
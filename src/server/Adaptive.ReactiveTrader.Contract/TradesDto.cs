using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Contract
{
    public class TradesDto
    {
        public static readonly TradesDto Empty = new TradesDto(new TradeDto[0], false);

        public TradesDto(IList<TradeDto> trades, bool isStateOfTheWorld)
        {
            Trades = trades;
            IsStateOfTheWorld = isStateOfTheWorld;
        }

        public IList<TradeDto> Trades { get; }
        public bool IsStateOfTheWorld { get; }
    }
}

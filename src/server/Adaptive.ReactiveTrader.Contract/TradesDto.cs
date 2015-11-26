using System.Collections.Generic;

namespace Adaptive.ReactiveTrader.Contract
{
    public class TradesDto
    {
        public static readonly TradesDto Empty = new TradesDto(new TradeDto[0]);

        public TradesDto(IList<TradeDto> trades)
        {
            Trades = trades;
        }

        IList<TradeDto> Trades { get; }
    }
}

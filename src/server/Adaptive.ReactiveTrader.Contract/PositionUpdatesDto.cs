using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.Contract
{
    public class PositionUpdatesDto
    {
        public PositionUpdatesDto()
        {
            CurrentPositions = Enumerable.Empty<CurrencyPairPositionDto>();
            History = Enumerable.Empty<HistoricPositionDto>();
        }
        public IEnumerable<CurrencyPairPositionDto> CurrentPositions { get; set; }
        public IEnumerable<HistoricPositionDto> History { get; set; }

        public override string ToString()
        {
            return $"CurrentPositions: {string.Join(", ", CurrentPositions)}, History: {string.Join(", ", History)}";
        }
    }
}
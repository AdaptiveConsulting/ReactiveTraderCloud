using System.Collections.Generic;
using System.Linq;

namespace Adaptive.ReactiveTrader.Shared.DTO.Analytics
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
            return string.Format("CurrentPositions: {0}, History: {1}", string.Join(", ", CurrentPositions), string.Join(", ", History));
        }
    }
}
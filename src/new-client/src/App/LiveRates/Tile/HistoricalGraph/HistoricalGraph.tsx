import styled from "styled-components/macro"
import { getHistoricalPrices$ } from "services/prices"
import { map } from "rxjs/operators"
import { getDataPoints, toSvgPath, withScales } from "utils/historicalChart"
import { pipe } from "rxjs"
import { curveBasis } from "d3"
import { symbolBind } from "../Tile.context"

const VIEW_BOX_WIDTH = 200
const VIEW_BOX_HEIGHT = 90

const [useHistoricalPath, historicalGraph$] = symbolBind((symbol: string) =>
  getHistoricalPrices$(symbol).pipe(
    map(
      pipe(
        getDataPoints((price, idx) => [new Date(idx), price.mid]),
        withScales([0, VIEW_BOX_WIDTH], [0, VIEW_BOX_HEIGHT]),
        toSvgPath(curveBasis),
      ),
    ),
  ),
)

const LineChartWrapper = styled.div<{ isTimerOn?: boolean }>`
  width: 100%;
  height: ${({ isTimerOn }) => (isTimerOn ? "60%" : "80%")};
  grid-area: chart;
`

const AnalyticsTileChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Path = styled.path``
const Svg = styled.svg`
  &:hover ${Path} {
    stroke: #5f94f5;
  }
`

export { historicalGraph$ }
export const HistoricalGraph: React.FC = () => {
  const d = useHistoricalPath()

  return (
    <LineChartWrapper>
      <AnalyticsTileChartWrapper>
        <Svg viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}>
          <Path
            stroke="#737987"
            strokeOpacity={0.9}
            strokeWidth={1.6}
            fill="none"
            width={VIEW_BOX_WIDTH}
            height={VIEW_BOX_HEIGHT}
            d={d}
          />
        </Svg>
      </AnalyticsTileChartWrapper>
    </LineChartWrapper>
  )
}

import styled from "styled-components/macro"
import { getHistoricalPrices$ } from "services/prices"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { getDataPoints, toSvgPath, withScales } from "utils/historicalChart"
import { pipe } from "rxjs"
import { curveBasis } from "d3"

const VIEW_BOX_WIDTH = 200
const VIEW_BOX_HEIGHT = 81

const [useHistoricalPath, analyticsTile$] = bind((symbol: string) =>
  getHistoricalPrices$(symbol).pipe(
    map(
      pipe(
        getDataPoints((price) => [new Date(price.valueDate), price.mid]),
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

export { analyticsTile$ }
export const AnalyticsTile: React.FC<{ symbol: string }> = ({ symbol: id }) => {
  const d = useHistoricalPath(id)

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

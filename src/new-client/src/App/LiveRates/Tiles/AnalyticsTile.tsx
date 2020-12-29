import styled from "styled-components/macro"
import { getHistoricalPrices$ } from "services/prices"
import { curveCatmullRom, line, scaleLinear, scaleTime } from "d3"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"

const curvedLine = line<[Date, number]>().curve(curveCatmullRom)

const VIEW_BOX_WIDTH = 200
const VIEW_BOX_HEIGHT = 81

export const xScale = scaleTime().range([0, VIEW_BOX_WIDTH])
export const yScale = scaleLinear().range([0, VIEW_BOX_HEIGHT])

const [useHistoricalPath, analyticsTile$] = bind((symbol: string) =>
  getHistoricalPrices$(symbol).pipe(
    map((prices) => {
      const points = prices.map(
        (price) => [new Date(price.valueDate), price.mid] as [Date, number],
      )
      const xRange = [points[0][0], points[points.length - 1][0]]
      const yValues = points.map((p) => p[1])
      const yRange = [Math.max(...yValues), Math.min(...yValues)] as const
      const x = xScale.domain(xRange)
      const y = yScale.domain(yRange)
      return curvedLine.x((d) => x(d[0])).y((d) => y(d[1]))(points)!
    }),
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

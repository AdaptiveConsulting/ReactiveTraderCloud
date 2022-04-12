import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"
import { bind } from "@react-rxjs/core"
import { curveBasis } from "d3"
import { map } from "rxjs/operators"
import styled from "styled-components"
import { updatesPerSecondHistory$ } from "./Updates"

const WIDTH = 100
const HEIGHT = 20
const [useHistoricalPath] = bind(
  updatesPerSecondHistory$.pipe(
    map((updates) => {
      const dataPoints = getDataPoints<number>((count, idx) => [
        new Date(idx),
        count,
      ])(updates)

      const scales = withScales([0, WIDTH], [0, HEIGHT])(dataPoints)
      return toSvgPath(curveBasis)(scales)
    }),
  ),
)

const LineChartWrapper = styled.div<{ showTimer?: boolean }>`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  grid-area: chart;
  margin-right: 10px;
`
const Path = styled.path``
const Svg = styled.svg`
  &:hover ${Path} {
    stroke: #5f94f5;
  }
`

export const UpdatesHistoricalGraph = () => {
  const path = useHistoricalPath()

  return path ? (
    <LineChartWrapper>
      <Svg>
        <Path
          stroke={"#737987"}
          strokeOpacity={0.9}
          strokeWidth={1.6}
          fill="none"
          d={path}
        />
      </Svg>
    </LineChartWrapper>
  ) : null
}

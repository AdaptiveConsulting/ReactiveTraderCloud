import { bind } from "@react-rxjs/core"
import { curveBasis } from "d3"
import { map } from "rxjs/operators"

import { HistoricalGraph } from "@/components/HistoricalGraph"
import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"

import { latencyHistory$ } from "./Latency"

const WIDTH = 100
const HEIGHT = 20

const [useHistoricalPath] = bind(
  latencyHistory$.pipe(
    map((history) => {
      const dataPoints = getDataPoints<number>((count, idx) => [
        new Date(idx),
        count,
      ])(history)

      const scales = withScales([0, WIDTH], [0, HEIGHT])(dataPoints)
      return toSvgPath(curveBasis)(scales)
    }),
  ),
)

export const LatencyHistoricalGraph = () => {
  const path = useHistoricalPath()

  return path ? (
    <HistoricalGraph path={path} size={{ width: WIDTH, height: HEIGHT }} />
  ) : null
}

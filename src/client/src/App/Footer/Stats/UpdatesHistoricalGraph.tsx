import { HistoricalGraph } from "@/components/HistoricalGraph"
import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"
import { bind } from "@react-rxjs/core"
import { curveBasis } from "d3"
import { map } from "rxjs/operators"
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

export const UpdatesHistoricalGraph = () => {
  const path = useHistoricalPath()

  return path ? (
    <HistoricalGraph path={path} size={{ width: WIDTH, height: HEIGHT }} />
  ) : null
}

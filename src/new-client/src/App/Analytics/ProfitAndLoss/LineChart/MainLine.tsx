import {
  LINE_CHART_HEIGHT,
  LINE_CHART_WIDTH,
  TOTAL_WIDTH,
  Y_LEGENDS_WIDTH,
} from "./constants"
import { dataPoints$ } from "./dataPoints$"
import { curveCatmullRom, line, scaleLinear, scaleTime } from "d3"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"

const curvedLine = line<[Date, number]>().curve(curveCatmullRom)
export const xScale = scaleTime().range([Y_LEGENDS_WIDTH, TOTAL_WIDTH])
export const yScale = scaleLinear().range([0, LINE_CHART_HEIGHT])
const offsetScale = scaleLinear().range([0, 1])

const [useMainLine, mainLine$] = bind(
  dataPoints$.pipe(
    map(({ xRange, yRange, points }) => {
      const x = xScale.domain(xRange)
      const y = yScale.domain(yRange)
      return {
        d: curvedLine.x((d) => x(d[0])).y((d) => y(d[1]))(points)!,
        offset: offsetScale.domain(yRange)(0),
      }
    }),
  ),
)

export { mainLine$ }
export const MainLine = () => {
  const { offset, d } = useMainLine()
  return (
    <>
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset={offset}
            stopColor="#28c988"
            stopOpacity="1"
            strokeWidth="1.2"
          ></stop>
          <stop
            offset={offset}
            stopColor="#f94c4c"
            stopOpacity="1"
            strokeWidth="1.2"
          ></stop>
        </linearGradient>
      </defs>
      <path
        stroke="url(#colorValue)"
        strokeWidth={2}
        fill="none"
        width={LINE_CHART_WIDTH}
        height={LINE_CHART_HEIGHT}
        d={d}
      />
    </>
  )
}

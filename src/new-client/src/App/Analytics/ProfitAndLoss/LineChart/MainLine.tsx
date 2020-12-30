import { LINE_CHART_HEIGHT, LINE_CHART_WIDTH } from "./constants"
import { dataPoints$ } from "./dataPoints$"
import { scaleLinear } from "d3"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { toSvgPath, Range } from "utils/historicalChart"

const getSvgPath = toSvgPath()

const offsetScale = scaleLinear().range([0, 1])
const getOffset = (yRange: Range<number>) => offsetScale.domain(yRange)(0)

const [useMainLine, mainLine$] = bind(
  dataPoints$.pipe(
    map(({ yRange, ...data }) => ({
      d: getSvgPath(data),
      offset: getOffset(yRange),
    })),
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

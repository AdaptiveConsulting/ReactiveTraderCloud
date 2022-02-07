import { LINE_CHART_HEIGHT, LINE_CHART_WIDTH } from "./constants"
import { dataPoints$ } from "./dataPoints$"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { toSvgPath } from "@/utils/historicalChart"

const [useD, mainLine$] = bind(dataPoints$.pipe(map(toSvgPath())))

export { mainLine$ }
export const MainLine = () => (
  <path
    stroke="url(#colorValue)"
    strokeWidth={2}
    fill="none"
    width={LINE_CHART_WIDTH}
    height={LINE_CHART_HEIGHT}
    d={useD()}
  />
)

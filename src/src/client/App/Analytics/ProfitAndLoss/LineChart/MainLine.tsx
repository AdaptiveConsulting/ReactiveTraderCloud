import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { toSvgPath } from "@/client/utils/historicalChart"

import { LINE_CHART_HEIGHT, LINE_CHART_WIDTH } from "./constants"
import { dataPoints$ } from "./dataPoints$"

const [useD, mainLine$] = bind(dataPoints$.pipe(map(toSvgPath())))

export { mainLine$ }
export const MainLine = () => (
  <path
    stroke="url(#colorValue)"
    strokeWidth={2}
    fill="none"
    width={LINE_CHART_WIDTH}
    height={LINE_CHART_HEIGHT}
    d={useD() || undefined}
  />
)

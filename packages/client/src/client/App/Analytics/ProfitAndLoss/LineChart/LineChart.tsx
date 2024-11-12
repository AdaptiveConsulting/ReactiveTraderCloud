import { useRef } from "react"
import { merge } from "rxjs"

import { Colors, colors$ } from "./Colors"
import { TOTAL_HEIGHT, TOTAL_WIDTH } from "./constants"
import { MainLine, mainLine$ } from "./MainLine"
import { ReferenceLine, referenceLine$ } from "./ReferenceLine"
import { TimeLegends, timeLegends$ } from "./TimeLegends"
import { Tooltip } from "./Tooltip"
import { ValueLegends, valueLegends$ } from "./ValueLegends"

export const LineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  return (
    <svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
      <Colors />
      <MainLine />
      <ReferenceLine />
      <TimeLegends />
      <ValueLegends />
      <Tooltip svgRef={svgRef} />
    </svg>
  )
}

export const lineChart$ = merge(
  colors$,
  mainLine$,
  referenceLine$,
  timeLegends$,
  valueLegends$,
)

import { useRef } from "react"
import { merge } from "rxjs"
import styled from "styled-components"

import { Colors, colors$ } from "./Colors"
import { TOTAL_HEIGHT, TOTAL_WIDTH } from "./constants"
import { MainLine, mainLine$ } from "./MainLine"
import { ReferenceLine, referenceLine$ } from "./ReferenceLine"
import { TimeLegends, timeLegends$ } from "./TimeLegends"
import { Tooltip } from "./Tooltip"
import { ValueLegends, valueLegends$ } from "./ValueLegends"

const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`

export const LineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  return (
    <AnalyticsLineChartStyle>
      <svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
        <Colors />
        <MainLine />
        <ReferenceLine />
        <TimeLegends />
        <ValueLegends />
        <Tooltip svgRef={svgRef} />
      </svg>
    </AnalyticsLineChartStyle>
  )
}

export const lineChart$ = merge(
  colors$,
  mainLine$,
  referenceLine$,
  timeLegends$,
  valueLegends$,
)

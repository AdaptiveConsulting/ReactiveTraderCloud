import styled from "styled-components"
import { Colors, colors$ } from "./Colors"
import { MainLine, mainLine$ } from "./MainLine"
import { Tooltip } from "./Tooltip"
import { TimeLegends, timeLegends$ } from "./TimeLegends"
import { ValueLegends, valueLegends$ } from "./ValueLegends"
import { TOTAL_WIDTH, TOTAL_HEIGHT } from "./constants"
import { merge } from "rxjs"
import { useRef } from "react"
import { ReferenceLine, referenceLine$ } from "./ReferenceLine"

const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`

export const LineChart: React.FC = () => {
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

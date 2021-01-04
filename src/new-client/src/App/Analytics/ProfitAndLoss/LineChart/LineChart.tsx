import styled from "styled-components/macro"
import { MainLine, mainLine$ } from "./MainLine"
import { Tooltip } from "./Tooltip"
import { TimeLegends, timeLegends$ } from "./TimeLegends"
import { ValueLegends, valueLegends$ } from "./ValueLegends"
import { TOTAL_WIDTH, TOTAL_HEIGHT } from "./constants"
import { merge } from "rxjs"
import { useRef } from "react"

const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  height: 100%;
  min-height: 35px; /* Required to avoid JS errors when resizing the height of the browser small enough such 
                        that the height of the chart is computed as negative values. -D.S. ARTP-394 */

  overflow: hidden;
  position: relative;
`

export const LineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  return (
    <AnalyticsLineChartStyle>
      <svg ref={svgRef} viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>
        <MainLine />
        <TimeLegends />
        <ValueLegends />
        <Tooltip svgRef={svgRef} />
      </svg>
    </AnalyticsLineChartStyle>
  )
}

export const lineChart$ = merge(mainLine$, timeLegends$, valueLegends$)

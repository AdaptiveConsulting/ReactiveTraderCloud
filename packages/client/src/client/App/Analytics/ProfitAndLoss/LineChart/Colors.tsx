import { bind } from "@react-rxjs/core"
import { scaleLinear } from "d3"
import { map } from "rxjs/operators"
import { useTheme } from "styled-components"

import { Range } from "@/client/utils/historicalChart"

import { dataPoints$ } from "./dataPoints$"

const offsetScale = scaleLinear().range([0, 1])
const getOffset = ({ yRange }: { yRange: Range<number> }) =>
  offsetScale.domain(yRange)(0)

const [useOffset, colors$] = bind(dataPoints$.pipe(map(getOffset)))

export { colors$ }
export const Colors = () => {
  const offset = useOffset()
  const theme = useTheme()
  return (
    <defs>
      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset={offset}
          stopColor={theme.color["Colors/Border/border-buy"]}
          stopOpacity="1"
          strokeWidth="1.2"
        ></stop>
        <stop
          offset={offset}
          stopColor={theme.color["Colors/Border/border-sell"]}
          stopOpacity="1"
          strokeWidth="1.2"
        ></stop>
      </linearGradient>
    </defs>
  )
}

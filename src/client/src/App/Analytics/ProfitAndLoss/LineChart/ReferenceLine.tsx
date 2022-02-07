import { LINE_CHART_WIDTH, Y_LEGENDS_WIDTH } from "./constants"
import { dataPoints$ } from "./dataPoints$"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"

const [useY, referenceLine$] = bind(
  dataPoints$.pipe(map(({ yScale }) => yScale(0))),
)

export { referenceLine$ }
export const ReferenceLine = () => {
  const y = useY()
  return (
    <line
      stroke="white"
      strokeOpacity="0.3"
      strokeWidth="1"
      fill="none"
      fillOpacity="1"
      x1={Y_LEGENDS_WIDTH}
      x2={Y_LEGENDS_WIDTH + LINE_CHART_WIDTH}
      y1={y}
      y2={y}
    />
  )
}

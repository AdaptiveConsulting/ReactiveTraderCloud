import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { dataPoints$ } from "./dataPoints$"
import { LINE_CHART_HEIGHT, Y_LEGENDS_WIDTH } from "./constants"
import { formatWithScale, precisionNumberFormatter } from "@/utils/formatNumber"
import { scaleLinear } from "d3"
import { Text } from "./Text"

const N_LABELS = 5
const scale = scaleLinear().domain([0, N_LABELS - 1])

const yScale = scale.range([10, LINE_CHART_HEIGHT])

const xText = Y_LEGENDS_WIDTH / 2 - 2
const labelPositions = Array(N_LABELS)
  .fill(null)
  .map((_, idx) => ({
    x: xText,
    y: yScale(idx),
  }))

const formatToPrecision1 = precisionNumberFormatter(1)

const [useLegends, valueLegends$] = bind(
  dataPoints$.pipe(
    map(({ yRange }) => {
      const y = scale.range(yRange)
      return labelPositions.map((labelPosition, idx) => ({
        ...labelPosition,
        value: formatWithScale(y(idx), formatToPrecision1),
      }))
    }),
  ),
)

export { valueLegends$ }
export const ValueLegends = () => (
  <>
    {useLegends().map(({ x, y, value }, idx) => (
      <Text key={idx} x={x} y={y}>
        {value}
      </Text>
    ))}
  </>
)

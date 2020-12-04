import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart as ReLineChart,
  ReferenceLine,
  Tooltip,
  Line,
} from "recharts"
import { map, pluck, scan, withLatestFrom } from "rxjs/operators"
import { history$ } from "services/analytics"
import { formatNumber } from "utils/formatNumber"
import {
  AnalyticsLineChartStyle,
  ToolTipStyle,
  ToolTipChildRight,
  ToolTipChildLeft,
} from "./styled"

const intervalWidth = 30
const xAxisPointsIdxs$ = history$.pipe(
  scan(
    ({ lastTimestamp }, values) => {
      const idx = values.findIndex((entry) => entry.timestamp === lastTimestamp)
      const currentOffset = idx === -1 ? 0 : idx % intervalWidth
      const idxs = values
        .map((_, idx) => idx)
        .filter(
          (idx) => (idx + currentOffset) % intervalWidth === 0 || idx === 0,
        )
      return { idxs, lastTimestamp: values[idxs[idxs.length - 1]].timestamp }
    },
    { lastTimestamp: -Infinity, idxs: [] as number[] },
  ),
  pluck("idxs"),
)

const [useChartData, chartData$] = bind(
  xAxisPointsIdxs$.pipe(
    withLatestFrom(history$),
    map(([xAxisIdxs, historical]) => {
      const yValues = historical.map((h) => h.usPnl)
      const max = Math.max(0, ...yValues)
      const min = Math.min(...yValues)
      const offset = min === 0 ? 1 : max / (max - min)

      const data = historical.map((entry) => ({
        y: entry.usPnl.toFixed(2),
        x: format(new Date(entry.timestamp), "HH:mm:ss aaaa"),
      }))

      return {
        offset,
        min,
        max,
        data,
        dataPoints: xAxisIdxs.map((idx) => data[idx]),
      }
    }),
  ),
)

const lineProps = {
  strokeDasharray: "4 3",
  stroke: "#444C5F",
  strokeOpacity: 0.9,
  strokeWidth: 0.8,
}

export const LineChart: React.FC = () => {
  const { offset, data, dataPoints, min, max } = useChartData()
  return (
    <AnalyticsLineChartStyle>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={offset}
                stopColor="#28c988"
                stopOpacity={1}
                strokeWidth={1.2}
              />
              <stop
                offset={offset}
                stopColor="#f94c4c"
                stopOpacity={1}
                strokeWidth={1.2}
              />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="y"
            stroke="url(#colorValue)"
            dot={false}
            strokeWidth={2}
          />
          <Tooltip
            offset={10}
            cursor={{ stroke: "#14161c", strokeWidth: 2 }}
            content={CustomTooltip}
          />
          <YAxis
            width={40}
            tickLine={false}
            padding={{ top: 0, bottom: 0 }}
            axisLine={false}
            domain={[min, max]}
          />

          <XAxis
            dataKey="x"
            tickLine={false}
            width={400}
            ticks={[data[0], ...dataPoints].map(({ x }) => x)}
            interval="preserveStartEnd"
            axisLine={false}
          />
          {offset < 1 && (
            <ReferenceLine
              y={0}
              stroke="white"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )}
          {[data[0], ...dataPoints].map(({ x }, i) => (
            <ReferenceLine key={i} x={x} {...lineProps} />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </AnalyticsLineChartStyle>
  )
}

interface ToolTipProps {
  payload: any[]
  label: string
}
const CustomTooltip: React.FC<ToolTipProps> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildLeft>{label}</ToolTipChildLeft>
      <ToolTipChildRight>
        {payload.length > 0 && formatNumber(Number(payload[0].value))}
      </ToolTipChildRight>
    </ToolTipStyle>
  )
}

export const lineChart$ = chartData$

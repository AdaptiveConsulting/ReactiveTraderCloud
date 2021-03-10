import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import { map, pluck, scan, withLatestFrom } from "rxjs/operators"
import { history$ } from "@/services/analytics"
import { dataPoints$ } from "./dataPoints$"
import { Text } from "./Text"
import { LINE_CHART_HEIGHT, X_LEGENDS_HEIGHT } from "./constants"

const INTERVAL_WIDTH = 30

const xAxisPointsIdxs$ = history$.pipe(
  scan(
    ({ lastTimestamp }, values) => {
      const idx =
        values.findIndex((entry) => entry.timestamp === lastTimestamp) + 1
      const currentOffset = idx % INTERVAL_WIDTH
      const idxs = values
        .map((_, idx) => idx)
        .filter(
          (idx) =>
            idx === 0 || (idx + 1 - currentOffset) % INTERVAL_WIDTH === 0,
        )
      return { idxs, lastTimestamp: values[idxs[idxs.length - 1]].timestamp }
    },
    { lastTimestamp: -Infinity, idxs: [] as number[] },
  ),
  pluck("idxs"),
)

const [useTimeMarks, timeLegends$] = bind(
  xAxisPointsIdxs$.pipe(
    withLatestFrom(dataPoints$),
    map(([xAxisIdxs, { points, xScale }]) =>
      xAxisIdxs.map((idx) => ({
        x: xScale(points[idx][0]),
        text: format(points[idx][0], "HH:mm:ss aaaa"),
      })),
    ),
  ),
)
export { timeLegends$ }

const yText = X_LEGENDS_HEIGHT / 2 + LINE_CHART_HEIGHT

export const TimeLegends = () => {
  const marks = useTimeMarks()
  const first = marks[0]
  const last = marks[marks.length - 1]
  return (
    <>
      {marks.map(({ text, x }) => (
        <line
          key={text}
          strokeDasharray="4 3"
          stroke="#444C5F"
          strokeOpacity="0.9"
          strokeWidth="0.8"
          fill="none"
          fillOpacity="1"
          x1={x}
          x2={x}
          y1="0"
          y2={LINE_CHART_HEIGHT}
        />
      ))}
      <Text textAnchor="start" y={yText} x={first.x}>
        {first.text}
      </Text>
      <Text textAnchor="end" y={yText} x={last.x}>
        {last.text}
      </Text>
    </>
  )
}

import { useState } from "react"
import styled from "styled-components/macro"
import {
  LineChart,
  ResponsiveContainer,
  Line,
  YAxis,
  ReferenceLine,
} from "recharts"
import { useHistoricalPrices, getHistoricalPrices$ } from "services/prices"

const LineChartWrapper = styled.div<{ isTimerOn?: boolean }>`
  width: 100%;
  height: ${({ isTimerOn }) => (isTimerOn ? "60%" : "80%")};
  grid-area: chart;
`

const AnalyticsTileChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

interface Props {
  symbol: string
}

const lineProps = {
  strokeDasharray: "4 3",
  stroke: "#737987",
  strokeOpacity: 0.9,
  strokeWidth: 0.8,
}

export const analyticsTile$ = getHistoricalPrices$
export const AnalyticsTile: React.FC<Props> = ({ symbol: id }) => {
  const history = useHistoricalPrices(id)
  const [chartColor, setChartColor] = useState("#737987")

  return (
    <LineChartWrapper>
      <AnalyticsTileChartWrapper
        onMouseEnter={() => setChartColor("#5f94f5")}
        onMouseLeave={() => setChartColor("#737987")}
      >
        <ResponsiveContainer data-qa="analytics-tile-chart__recharts-container">
          <LineChart
            width={100}
            height={100}
            data={history}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <Line
              dataKey="mid"
              dot={false}
              stroke={chartColor}
              strokeWidth={1.6}
              isAnimationActive={false}
            />
            <YAxis
              width={0}
              domain={["dataMin", "dataMax"]}
              axisLine={false}
              tickLine={false}
              padding={{ top: 0, bottom: 0 }}
              tick={false}
            />
            <ReferenceLine y={0} {...lineProps} />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsTileChartWrapper>
    </LineChartWrapper>
  )
}

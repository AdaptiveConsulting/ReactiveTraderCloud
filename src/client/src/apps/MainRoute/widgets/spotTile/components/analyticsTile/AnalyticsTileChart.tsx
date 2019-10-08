import React from 'react'
import { LineChart, ResponsiveContainer, Line, YAxis, ReferenceLine } from 'recharts'
import { styled } from 'rt-theme'
import { SpotPriceTick } from '../../model'

const AnalyticsTileChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

interface Props {
  history: SpotPriceTick[]
}
const AnalyticsTileChart: React.FC<Props> = ({ history }) => {
  const data = history.slice(history.length - 100, history.length)
  const lineProps = {
    strokeDasharray: '4 3',
    stroke: '#737987',
    strokeOpacity: 0.9,
    strokeWidth: 0.8,
  }
  return (
    <AnalyticsTileChartWrapper>
      <ResponsiveContainer
        width="100%"
        height="100%"
        data-qa="analytics-tile-chart__recharts-container"
      >
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="lineColour" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#737987" stopOpacity={1} strokeWidth={1.2} />
            </linearGradient>
          </defs>
          <Line dataKey="mid" dot={false} stroke="url(#lineColour)" isAnimationActive={false} />
          <YAxis
            width={0}
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            padding={{ top: 0, bottom: 0 }}
            tick={false}
          />
          <ReferenceLine y={0} {...lineProps} />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsTileChartWrapper>
  )
}

export default AnalyticsTileChart

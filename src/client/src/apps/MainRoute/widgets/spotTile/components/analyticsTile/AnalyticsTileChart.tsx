import React, { useState } from 'react'
import { LineChart, ResponsiveContainer, Line, YAxis, ReferenceLine } from 'recharts'
import styled from 'styled-components/macro'
import { SpotPriceTick } from '../../model'

const AnalyticsTileChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

interface Props {
  history: SpotPriceTick[]
  over?: boolean
}
const AnalyticsTileChart: React.FC<Props> = ({ history, over = false }) => {
  const lineProps = {
    strokeDasharray: '4 3',
    stroke: '#737987',
    strokeOpacity: 0.9,
    strokeWidth: 0.8,
  }

  const [chartColor, setChartColor] = useState('#737987')

  const handleMouseEvent = () => {
    setChartColor(chartColor === '#5f94f5' && !over ? '#737987' : '#5f94f5')
  }

  return (
    <AnalyticsTileChartWrapper onMouseEnter={handleMouseEvent} onMouseLeave={handleMouseEvent}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        data-qa="analytics-tile-chart__recharts-container"
      >
        <LineChart data={history} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Line
            dataKey="mid"
            dot={false}
            stroke={chartColor}
            strokeWidth={1.6}
            isAnimationActive={false}
          />
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

import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, ReferenceLine, Tooltip } from 'recharts'
import { ToolTipStyle, ToolTipChildRight, ToolTipChildLeft, AnalyticsLineChartStyle } from './styled'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'

interface LineChartProps {
  model: AnalyticsLineChartModel
}

interface DataPoint {
  x: string
  y: string
}

const tickFormatYAxis: ((x: string) => string) = x => {
  const val = numeral(x).format('0.0a')
  return val.substring(0, val.length - 1)
}

const getGradientOffset: ((data: DataPoint[]) => number) = data => {
  const yValues = data.map(i => parseInt(i.y, 10))
  const dataMax = Math.max(...yValues)
  const dataMin = Math.min(...yValues)

  if (dataMax < 0) {
    return 0
  }
  if (dataMin >= 0) {
    return 1
  }

  return dataMax / (dataMax - dataMin)
}

interface ToolTipProps {
  payload: any[]
  label: string
}

const CustomTooltip: React.SFC<ToolTipProps> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildRight>{label}</ToolTipChildRight>
      <ToolTipChildLeft>{payload.length > 0 && tickFormatYAxis(payload[0].value)}</ToolTipChildLeft>
    </ToolTipStyle>
  )
}

const LineCharts: React.SFC<LineChartProps> = ({ model: { seriesData } }) => {
  const data = seriesData.map(serie => ({ x: moment(serie.x).format('hh:mm:ss A'), y: serie.y }))
  const offset = getGradientOffset(data)
  return seriesData.length > 0 ? (
    <AnalyticsLineChartStyle>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 50 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor="#28c988" stopOpacity={1} strokeWidth={1.2} />
              <stop offset={offset} stopColor="#f94c4c" stopOpacity={1} strokeWidth={1.2} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" tickLine={false} interval={'preserveStartEnd'} stroke="#444c5f" width={400} />
          <YAxis
            tickFormatter={tickFormatYAxis}
            tickLine={false}
            label={{ value: '(M)', position: 'top', offset: 5, fill: 'white', fontSize: '8' }}
            padding={{ top: 35, bottom: 0 }}
          />
          {offset < 1 && <ReferenceLine y={0} stroke="white" strokeOpacity={0.2} />}
          <Tooltip offset={10} cursor={{ stroke: '#14161c', strokeWidth: 2 }} content={CustomTooltip} />
          <Line type="monotone" dataKey="y" stroke="url(#colorValue)" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsLineChartStyle>
  ) : null
}

export default LineCharts

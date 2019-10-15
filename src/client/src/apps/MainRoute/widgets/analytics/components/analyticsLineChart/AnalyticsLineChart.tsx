import React, { useCallback, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import numeral from 'numeral'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  ReferenceLine,
  Tooltip,
  Line,
} from 'recharts'
import {
  AnalyticsLineChartStyle,
  ToolTipStyle,
  ToolTipChildRight,
  ToolTipChildLeft,
} from './styled'
import { AnalyticsLineChartModel, PricePoint } from '../../model/AnalyticsLineChartModel'

interface LineChartProps {
  model: AnalyticsLineChartModel
}

interface DataPoint {
  x: string
  y: string
}

const formatDataPoint: (dataPoint: PricePoint) => DataPoint = ({ x, y }) => ({
  x: DateTime.fromJSDate(x).toFormat('hh:mm:ss a'),
  y,
})

const tickFormatYAxis: (x: string) => string = x => numeral(x).format('0.0a')

const getLinearGradientOffset: (data: DataPoint[]) => number = data => {
  const yValues = data.map(i => parseInt(i.y, 10))
  const dataMax = Math.max(...yValues)
  const dataMin = Math.min(...yValues)

  if (dataMax <= 0) {
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

const CustomTooltip: React.FC<ToolTipProps> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildLeft>{label}</ToolTipChildLeft>
      <ToolTipChildRight>
        {payload.length > 0 && numeral(payload[0].value).format('0.0a')}
      </ToolTipChildRight>
    </ToolTipStyle>
  )
}

const intervalWidth = 30

const lineProps = {
  strokeDasharray: '4 3',
  stroke: '#444C5F',
  strokeOpacity: 0.9,
  strokeWidth: 0.8,
}

const LineCharts: React.FC<LineChartProps> = React.memo(props => {
  const [offsetState, setOffsetState] = useState<number>(0)

  useEffect(() => {
    const newOffset = offsetState + 1 === intervalWidth ? 0 : offsetState + 1
    setOffsetState(newOffset)
  }, [props, offsetState])

  const getDataPoint = useCallback(
    (dataPoints: DataPoint[]) =>
      dataPoints.filter((value, index) => (index + offsetState) % intervalWidth === 0),
    [offsetState],
  )

  const { seriesData } = props.model
  const data = seriesData.map(formatDataPoint)
  const offset = getLinearGradientOffset(data)
  const dataPoints = getDataPoint(data)

  const yValues = data.map(i => parseInt(i.y, 10))
  const dataMax = Math.max(...yValues)
  const dataMin = Math.min(...yValues)

  return seriesData.length > 0 ? (
    <AnalyticsLineChartStyle>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor="#28c988" stopOpacity={1} strokeWidth={1.2} />
              <stop offset={offset} stopColor="#f94c4c" stopOpacity={1} strokeWidth={1.2} />
            </linearGradient>
          </defs>
          <Line type="monotone" dataKey="y" stroke="url(#colorValue)" dot={false} strokeWidth={2} />
          <Tooltip
            offset={10}
            cursor={{ stroke: '#14161c', strokeWidth: 2 }}
            content={CustomTooltip}
          />
          <YAxis
            width={40}
            tickLine={false}
            padding={{ top: 0, bottom: 0 }}
            axisLine={false}
            tickFormatter={tickFormatYAxis}
            domain={[dataMin, dataMax]}
          />

          <XAxis
            dataKey="x"
            tickLine={false}
            width={400}
            ticks={[data[0], ...dataPoints].map(({ x }) => x)}
            interval="preserveStartEnd"
            axisLine={false}
          />
          {offset < 1 && <ReferenceLine y={0} stroke="white" strokeOpacity={0.3} strokeWidth={1} />}
          {[data[0], ...dataPoints].map(({ x }, i) => (
            <ReferenceLine key={i} x={x} {...lineProps} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsLineChartStyle>
  ) : null
})

export default LineCharts

import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, ReferenceLine, Tooltip } from 'recharts'
import { ToolTipStyle, ToolTipChildRight, ToolTipChildLeft } from './styled'

interface LineChartProps {
  seriesData: PricePoint[]
}

interface PricePoint {
  x: Date
  y: string
}

interface DataPoint {
  x: string
  y: string
}

const tickFormatYAxis = (x: string) => numeral(x).format('0.0a')

const getGradientOffset = (data: DataPoint[]) => {
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

interface Foo {
  payload: any[]
  label: string
}

const CustomTooltip: React.SFC<Foo> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildRight>{label}</ToolTipChildRight>
      <ToolTipChildLeft>{payload.length > 0 && tickFormatYAxis(payload[0].value)}</ToolTipChildLeft>
    </ToolTipStyle>
  )
}

class LineChartContainer extends React.PureComponent<LineChartProps> {
  render() {
    const data = this.props.seriesData.map(serie => ({ x: moment(serie.x).format('hh:mm:ss A'), y: serie.y }))
    const offset = getGradientOffset(data)
    return (
      this.props.seriesData.length > 0 && (
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data} margin={{ top: 15, right: 50 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset={offset} stopColor="#28c988" stopOpacity={1} strokeWidth={2} />
                <stop offset={offset} stopColor="#f94c4c" stopOpacity={1} strokeWidth={2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="x" tickLine={false} interval={'preserveStartEnd'} />
            <YAxis tickFormatter={tickFormatYAxis} tickLine={false} interval={'preserveStartEnd'} />
            {offset < 1 && <ReferenceLine y={0} stroke="white" strokeOpacity={0.2} />}
            <Tooltip
              itemStyle={{ background: '#14161c' }}
              offset={10}
              cursor={{ stroke: '#14161c', strokeWidth: 0.8 }}
              content={CustomTooltip}
            />
            <Line type="monotone" dataKey="y" stroke="url(#colorValue)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    )
  }
}

export default LineChartContainer

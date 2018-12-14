import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { XAxis, YAxis, ResponsiveContainer, LineChart, ReferenceLine, Tooltip, Line } from 'recharts'
import { ToolTipStyle, ToolTipChildRight, ToolTipChildLeft } from './styled'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { styled } from 'rt-theme'

export const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  height: 100%;
  .recharts-cartesian-axis-ticks {
    color: #ffffff;
    width: 52px;
    height: 12px;
    opacity: 1;
    font-size: 10px;
  }
`

interface LineChartProps {
  model: AnalyticsLineChartModel
}

interface DataPoint {
  x: string
  y: string
}

const tickFormatYAxis: ((x: string) => string) = x => numeral(x).format('0.0a')

const getLinearGradientOffset: ((data: DataPoint[]) => number) = data => {
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

const CustomTooltip: React.SFC<ToolTipProps> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildLeft>{label}</ToolTipChildLeft>
      <ToolTipChildRight>{payload.length > 0 && numeral(payload[0].value).format('0.0a')}</ToolTipChildRight>
    </ToolTipStyle>
  )
}

interface LineChartState {
  offset: number
}
class LineCharts extends React.PureComponent<LineChartProps, LineChartState> {
  private intervalWidth: number = 30
  constructor(props: LineChartProps) {
    super(props)

    this.state = {
      offset: 0,
    }
  }

  getDataPoint = (dataPoints: DataPoint[]) =>
    dataPoints.filter((value, index) => (index + this.state.offset) % this.intervalWidth === 0)

  componentDidUpdate(prevProps: LineChartProps) {
    if (prevProps !== this.props) {
      const offset = this.state.offset + 1 === this.intervalWidth ? 0 : this.state.offset + 1
      this.setState({ offset })
    }
  }
  render() {
    const {
      model: { seriesData },
    } = this.props
    const data = seriesData.map(({ x, y }) => ({ x: moment(x).format('hh:mm:ss A'), y }))
    const offset = getLinearGradientOffset(data)
    const lineProps = { strokeDasharray: '4 3', stroke: 'white', strokeOpacity: 0.3, strokeWidth: 1 }
    const dataPoints = this.getDataPoint(data)
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
            <Tooltip offset={10} cursor={{ stroke: '#14161c', strokeWidth: 2 }} content={CustomTooltip} />
            <YAxis
              width={42}
              tickLine={false}
              padding={{ top: 0, bottom: 0 }}
              axisLine={false}
              tickFormatter={tickFormatYAxis}
            />

            <XAxis
              dataKey="x"
              tickLine={false}
              width={400}
              ticks={[...dataPoints.map(({ x }) => x)]}
              interval="preserveStartEnd"
            />
            {offset < 1 && <ReferenceLine y={0} stroke="white" strokeOpacity={0.3} strokeWidth={1} />}
            {dataPoints.map(({ x }) => (
              <ReferenceLine key={x} x={x} {...lineProps} />
            ))}
            <ReferenceLine x={data[0].x} {...lineProps} />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsLineChartStyle>
    ) : null
  }
}

export default LineCharts

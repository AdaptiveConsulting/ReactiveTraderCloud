import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPairMap } from 'rt-types'
import { CurrencyPairPosition } from '../model'
import { ResponsiveContainer, XAxis, LineChart } from 'recharts'
import numeral from 'numeral'

//TODO change name for this one
const WorkDiv = styled.div`
  width: 100%;
  height: 10%;
  .fooDiv {
    display: flex;
    flex: 0 50%;
    width: 100%;
    height: 50%;
    align-items: center;
  }
`
//TODO change name for this one
const SpanDiv = styled.div`
  color: #ffffff;
  font-family: Lato;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin-top: 2px;
  text-align: center;
  margin-bottom: 15px;
`
interface Props {
  chartData: CurrencyPairPosition[]
  currencyPairs: CurrencyPairMap
  isPnL: boolean
}

interface CustomizeTickProps {
  x: number
  y: number
  payload: any
}
const CustomizeTick: React.SFC<CustomizeTickProps> = ({ x, y, payload }) => {
  if (payload.value === 0) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-4} y={-5} dy={16} fontSize={11} textAnchor="center" fill="#ffffff">
          0
        </text>
      </g>
    )
  }
  const value = Math.exp(Math.abs(payload.value))
  const color = payload.value >= 0 ? '#28c988' : '#e04444'
  return (
    <g transform={`translate(${x},${y})`}>
      <text fontSize="10" x={-1} y={-20} dy={16} textAnchor="center" fill={color}>
        {numeral(value).format('0a')}
      </text>
      <rect
        x="-16"
        y="0"
        dy={16}
        transform="rotate(45)"
        width="5"
        height="5"
        stroke={color}
        fill={color}
        strokeWidth="2"
      />
    </g>
  )
}
const BarCharts: React.SFC<Props> = ({ chartData, currencyPairs }) => {
  const { max, min } = getMinMax(chartData)
  const maxWidth = Math.max(Math.abs(max), Math.abs(min))
  const maxScale = Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min)
  return (
    <WorkDiv>
      {chartData.map((chartItem, index) => {
        const { basePnl, symbol } = chartItem
        const currencyPair = currencyPairs[symbol]
        const sign = basePnl >= 0 ? 1 : -1
        return (
          <div key={index} className="fooDiv">
            <SpanDiv>{currencyPair.symbol}</SpanDiv>
            <ResponsiveContainer width="90%" height="80%">
              <LineChart stackOffset="sign" margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                >
                <XAxis
                  dataKey="symbol"
                  interval={0}
                  type="number"
                  domain={[-Math.log(maxScale) - 5, Math.log(maxScale) + 5]}
                  ticks={[0, sign * Math.log(Math.abs(basePnl))]}
                  tick={CustomizeTick}
                  stroke="#444c5f"
                  width={maxWidth}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </WorkDiv>
  )
}

export default BarCharts

const getMinMax = (chartData: CurrencyPairPosition[]) =>
  chartData.reduce(
    (prev, curr) => {
      const { basePnl } = curr
      prev.max = Math.max(prev.max, basePnl)
      prev.min = Math.min(prev.min, basePnl)
      return prev
    },
    { max: 0, min: 0 },
  )

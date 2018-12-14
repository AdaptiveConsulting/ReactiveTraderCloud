import React from 'react'
import { CurrencyPairPosition } from '../model'
import PNLBar from './PNLBar'

export interface Props {
  chartData: CurrencyPairPosition[]
}

const AnalyticsBarChart: React.SFC<Props> = ({ chartData }) => {
  const { max, min } = getMinMax(chartData)
  const maxWidth = Math.max(Math.abs(max), Math.abs(min))
  return (
    <React.Fragment>
      {chartData.map((chartItem, index) => {
        const { basePnl, symbol } = chartItem
        return <PNLBar key={index} basePnl={basePnl} symbol={symbol} maxVal={maxWidth} />
      })}
    </React.Fragment>
  )
}

export default AnalyticsBarChart

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
